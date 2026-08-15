import {execFileSync} from 'node:child_process';
import {existsSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const projectDir = resolve(repoRoot, 'project');
const errors = [];

const readJson = (relativePath) => {
  const path = resolve(repoRoot, relativePath);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
};

const manifest = readJson('project-manifest.json');
const assetMap = readJson('workflow/asset-map.json');
const sceneMap = readJson('workflow/scene-map.json');
const promptMap = readJson('workflow/prompt-index.json');

for (const asset of assetMap?.assets ?? []) {
  const path = resolve(projectDir, 'public', asset.path);
  if (!existsSync(path)) errors.push(`Thiếu asset: ${asset.path}`);
}

const rootSource = existsSync(resolve(projectDir, 'src/Root.tsx'))
  ? readFileSync(resolve(projectDir, 'src/Root.tsx'), 'utf8')
  : '';
for (const id of manifest?.compositions?.expected ?? []) {
  if (!rootSource.includes(`id="${id}"`) && !rootSource.includes("id={id}")) {
    errors.push(`Không tìm thấy composition trong Root.tsx: ${id}`);
  }
}

if ((sceneMap?.scenes ?? []).length < 6) errors.push('Scene map chưa đủ 5 scene và CTA.');
if ((promptMap?.prompts ?? []).length < 7) errors.push('Prompt index chưa đủ prompt tổng và từng scene.');

if (errors.length) {
  console.error('KIỂM TRA DỰ ÁN: CHƯA ĐẠT');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log('KIỂM TRA DỰ ÁN: ĐẠT');
  console.log(`Project: ${manifest.title}`);
  console.log(`Asset đã đối chiếu: ${assetMap.assets.length}`);
  console.log(`Scene đã lập bản đồ: ${sceneMap.scenes.length}`);
  console.log(`Prompt đã lập chỉ mục: ${promptMap.prompts.length}`);
}

if (process.argv.includes('--compositions')) {
  const runner = existsSync(resolve(projectDir, 'bun.lock')) ? 'bunx' : 'npx';
  try {
    const output = execFileSync(runner, ['remotion', 'compositions', 'src/index.ts'], {
      cwd: projectDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    console.log(output.trim());
  } catch (error) {
    console.error('Không thể liệt kê composition. Hãy cài dependencies trước.');
    console.error(error.stderr?.toString().trim() ?? error.message);
    process.exitCode = 1;
  }
}
