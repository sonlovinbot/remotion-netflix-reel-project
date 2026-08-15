import {cpSync, existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '../..');
const templateDir = resolve(repoRoot, 'templates/new-project');
const projectsDir = resolve(repoRoot, 'projects');
const slug = process.argv[2];
const titleFlag = process.argv.indexOf('--title');
const title = titleFlag >= 0 ? process.argv[titleFlag + 1] : slug;
const dryRun = process.argv.includes('--dry-run');

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Tên project phải dùng chữ thường, số và dấu gạch ngang.');
  process.exit(1);
}

if (['project', 'project-01', 'project-01-netflix-reel'].includes(slug)) {
  console.error('Tên này được dành cho Project 1. Hãy chọn tên khác.');
  process.exit(1);
}

const targetDir = resolve(projectsDir, slug);
if (existsSync(targetDir)) {
  console.error(`Project đã tồn tại: ${targetDir}`);
  process.exit(1);
}

if (!existsSync(templateDir)) {
  console.error('Không tìm thấy template Project 2.');
  process.exit(1);
}

if (dryRun) {
  const manifest = JSON.parse(readFileSync(resolve(templateDir, 'project.json'), 'utf8'));
  console.log('KIỂM TRA TẠO PROJECT MỚI: ĐẠT');
  console.log(`Tên dự kiến: ${title || slug}`);
  console.log(`Thư mục dự kiến: ${targetDir}`);
  console.log(`Template: ${manifest.title}`);
  process.exit(0);
}

mkdirSync(projectsDir, {recursive: true});
cpSync(templateDir, targetDir, {recursive: true, errorOnExist: true});

const manifestPath = resolve(targetDir, 'project.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.id = slug;
manifest.title = title || slug;
manifest.createdFrom = 'project-01-netflix-reel-workflow';
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log('ĐÃ TẠO KHUNG DỰ ÁN MỚI');
console.log(`Tên: ${manifest.title}`);
console.log(`Thư mục: ${targetDir}`);
console.log('Bước tiếp theo: hoàn thiện brief và chờ duyệt trước khi dựng scene.');
