import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync, readdirSync, statfsSync} from 'node:fs';
import {arch, freemem, platform, totalmem} from 'node:os';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const projectDir = resolve(repoRoot, 'project');
const asJson = process.argv.includes('--json');

const commandVersion = (command, args = ['--version']) => {
  try {
    return execFileSync(command, args, {encoding: 'utf8'}).trim().split('\n')[0];
  } catch {
    return null;
  }
};

const walk = (directory) => {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    if (entry.name === '.DS_Store') return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
};

const gib = (bytes) => Math.round((bytes / 1024 ** 3) * 10) / 10;
const packagePath = resolve(projectDir, 'package.json');
const packageJson = existsSync(packagePath)
  ? JSON.parse(readFileSync(packagePath, 'utf8'))
  : null;
const disk = statfsSync(repoRoot);
const assetFiles = walk(resolve(projectDir, 'public/assets'));
const audioFiles = assetFiles.filter((file) => /\.(wav|mp3|m4a|aac)$/i.test(file));
const imageFiles = assetFiles.filter((file) => /\.(png|jpe?g|webp|svg|gif)$/i.test(file));
const required = [
  'README.md',
  'AGENTS.md',
  'project-manifest.json',
  'workflow/asset-map.json',
  'workflow/scene-map.json',
  'workflow/prompt-index.json',
  'project/package.json',
  'project/bun.lock',
  'project/src/index.ts',
  'project/src/Root.tsx',
];
const missingFiles = required.filter((file) => !existsSync(resolve(repoRoot, file)));

const report = {
  machine: {
    platform: platform(),
    architecture: arch(),
    totalMemoryGiB: gib(totalmem()),
    freeMemoryGiB: gib(freemem()),
    freeDiskGiB: gib(disk.bavail * disk.bsize),
  },
  tools: {
    git: commandVersion('git'),
    bun: commandVersion('bun'),
    node: commandVersion('node'),
  },
  repository: {
    root: repoRoot,
    projectFound: existsSync(projectDir),
    packageName: packageJson?.name ?? null,
    remotionVersion: packageJson?.dependencies?.remotion ?? null,
    dependenciesInstalled: existsSync(resolve(projectDir, 'node_modules/remotion')),
    images: imageFiles.length,
    audio: audioFiles.length,
    missingFiles,
  },
};

report.warnings = [];
if (report.machine.freeDiskGiB < 10) {
  report.warnings.push('Ổ đĩa còn dưới 10 GiB. Nên dọn thêm dung lượng trước khi cài lại thư viện hoặc render video.');
}

report.ready = Boolean(
  report.repository.projectFound &&
    report.repository.remotionVersion &&
    report.repository.missingFiles.length === 0 &&
    (report.tools.bun || report.tools.node),
);

if (asJson) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const yesNo = (value) => (value ? 'Có' : 'Chưa có');
  console.log('KẾT QUẢ KIỂM TRA CHỈ ĐỌC');
  console.log(`Hệ điều hành: ${report.machine.platform} (${report.machine.architecture})`);
  console.log(`RAM: ${report.machine.totalMemoryGiB} GiB, còn trống ${report.machine.freeMemoryGiB} GiB`);
  console.log(`Ổ đĩa còn trống: ${report.machine.freeDiskGiB} GiB`);
  console.log(`Git: ${report.tools.git ?? 'Chưa có'}`);
  console.log(`Bun: ${report.tools.bun ?? 'Chưa có'}`);
  console.log(`Node.js: ${report.tools.node ?? 'Chưa có'}`);
  console.log(`Dự án Remotion: ${yesNo(report.repository.projectFound)}`);
  console.log(`Thư viện đã cài: ${yesNo(report.repository.dependenciesInstalled)}`);
  console.log(`Asset: ${report.repository.images} ảnh, ${report.repository.audio} audio`);
  console.log(`File bắt buộc còn thiếu: ${report.repository.missingFiles.length}`);
  console.log(`Trạng thái nền tảng: ${report.ready ? 'Sẵn sàng để tiếp tục' : 'Cần chuẩn bị thêm'}`);
  for (const warning of report.warnings) console.log(`Lưu ý: ${warning}`);
  console.log('Doctor không cài đặt và không thay đổi file.');
}
