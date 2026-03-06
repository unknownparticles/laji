import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { convertMdToPdf, rebuildPapersRegistry } from './import_papers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const papersDir = path.join(rootDir, 'src', 'data', 'papers');

function cleanTitle(title: string): string {
    return title.replace(/^(标题|Title|Topic|Theme)[:：\s]*/i, '').trim();
}

function cleanContent(content: string): string {
    // Remove (AI生成) or （AI生成） from the end
    return content.replace(/[（\(]AI生成[）\)]\s*$/g, '').trim();
}

async function cleanup() {
    console.log('Starting paper cleanup...');
    const journalFolders = fs.readdirSync(papersDir).filter(f => fs.statSync(path.join(papersDir, f)).isDirectory());

    let deletedCount = 0;
    let fixedCount = 0;

    for (const journal of journalFolders) {
        const journalPath = path.join(papersDir, journal);
        const files = fs.readdirSync(journalPath);

        // Map base names to their associated files
        const paperMap: Record<string, { ts?: string, md?: string, pdf?: string }> = {};

        files.forEach(file => {
            const ext = path.extname(file).toLowerCase();
            const base = path.basename(file, ext);
            if (!paperMap[base]) paperMap[base] = {};
            if (ext === '.ts') paperMap[base].ts = file;
            if (ext === '.md') paperMap[base].md = file;
            if (ext === '.pdf') paperMap[base].pdf = file;
        });

        for (const [base, paperFiles] of Object.entries(paperMap)) {
            const tsPath = paperFiles.ts ? path.join(journalPath, paperFiles.ts) : null;
            const mdPath = paperFiles.md ? path.join(journalPath, paperFiles.md) : null;
            const pdfPath = paperFiles.pdf ? path.join(journalPath, paperFiles.pdf) : null;

            let shouldDelete = false;

            // 1. Check if it's "无标题"
            if (tsPath) {
                const tsContent = fs.readFileSync(tsPath, 'utf-8');
                if (tsContent.includes('"zh": "无标题"') || tsContent.includes('"zh": "Untitled"')) {
                    shouldDelete = true;
                }
            }

            if (shouldDelete) {
                console.log(`Deleting "Untitled" paper: ${base}`);
                if (tsPath) fs.unlinkSync(tsPath);
                if (mdPath) fs.unlinkSync(mdPath);
                if (pdfPath) fs.unlinkSync(pdfPath);
                deletedCount++;
                continue;
            }

            // 2. Clean up MD and TS content
            let contentModified = false;

            if (mdPath) {
                let mdContent = fs.readFileSync(mdPath, 'utf-8');
                const originalMd = mdContent;

                // Clean title in MD
                mdContent = mdContent.replace(/^(#+\s+)(标题|Title|Topic|Theme)[:：\s]*/im, '$1');
                // Clean body
                mdContent = cleanContent(mdContent);

                if (mdContent !== originalMd) {
                    fs.writeFileSync(mdPath, mdContent, 'utf-8');
                    contentModified = true;
                }
            }

            if (tsPath) {
                let tsContent = fs.readFileSync(tsPath, 'utf-8');
                const originalTs = tsContent;

                // Extract title from JSON
                const titleMatch = tsContent.match(/"zh":\s*"([^"]+)"/);
                if (titleMatch) {
                    const originalTitle = titleMatch[1];
                    const newTitle = cleanTitle(originalTitle);
                    if (originalTitle !== newTitle) {
                        tsContent = tsContent.replace(`"zh": "${originalTitle}"`, `"zh": "${newTitle}"`);
                        tsContent = tsContent.replace(`"en": "${originalTitle}"`, `"en": "${newTitle}"`);
                        contentModified = true;
                    }
                }

                // Clean AI tags in content within TS
                tsContent = cleanContent(tsContent);

                if (tsContent !== originalTs) {
                    fs.writeFileSync(tsPath, tsContent, 'utf-8');
                    contentModified = true;
                }
            }

            // 3. Regenerate PDF if content was modified or if it exists
            if (mdPath && contentModified) {
                console.log(`Regenerating PDF for: ${base}`);
                await convertMdToPdf(mdPath);
                fixedCount++;
            }
        }
    }

    await rebuildPapersRegistry();
    console.log(`Cleanup finished. Deleted: ${deletedCount}, Fixed/Regenerated: ${fixedCount}`);
}

cleanup().catch(console.error);
