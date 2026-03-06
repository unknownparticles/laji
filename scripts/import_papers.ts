import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { GoogleGenAI } from '@google/genai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParseLib = require('pdf-parse');
const pdfParse = typeof pdfParseLib === 'function' ? pdfParseLib : (pdfParseLib.default || pdfParseLib);
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import { mdToPdf } from 'md-to-pdf';
import { Paper } from '../src/types.js';

// Setup basic __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

const aiKey = process.env.GEMINI_API_KEY;
if (!aiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is missing.');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: aiKey });
const unknownPapersDir = path.join(rootDir, 'src', 'data', 'papers', 'unknown');
const outputBaseDir = path.join(rootDir, 'src', 'data', 'papers');

// Helper to sanitize journal names into folder names
function slugify(text: string): string {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

async function extractTextFromPDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdf = new pdfParse.PDFParse({ data: dataBuffer });
    const result = await pdf.getText();
    let text = result.text || '';
    // Strip trailing (AI生成) tag
    text = text.replace(/（AI生成）\s*$/g, '').trim();
    return text;
}

async function extractTextFromDocx(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
}

function parseMdManual(content: string): Paper | null {
    if (!content || content.trim().length === 0) {
        return null;
    }

    const lines = content.split('\n');
    let title = '';
    let abstractZh = '';
    let abstractEn = '';
    let inAbstractZh = false;
    let inAbstractEn = false;
    let keywordsZh: string[] = [];
    let keywordsEn: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!title && (trimmed.startsWith('# ') || trimmed.startsWith('## ') || trimmed.startsWith('### '))) {
            title = trimmed.replace(/^#+\s+/, '').trim();
        } else if (trimmed.toLowerCase().includes('#### 摘要') || trimmed.toLowerCase().includes('#### abstract')) {
            if (trimmed.toLowerCase().includes('摘要')) { inAbstractZh = true; inAbstractEn = false; }
            else { inAbstractEn = true; inAbstractZh = false; }
        } else if ((inAbstractZh || inAbstractEn) && (trimmed.startsWith('####') || trimmed.startsWith('**关键词'))) {
            inAbstractZh = false;
            inAbstractEn = false;
        } else if (inAbstractZh) {
            abstractZh += trimmed + ' ';
        } else if (inAbstractEn) {
            abstractEn += trimmed + ' ';
        } else if (trimmed.includes('**关键词:**') || trimmed.includes('**Keywords:**') || trimmed.includes('**关键词：**')) {
            const k = trimmed.split(/[:：]/)[1]?.split(/[;；,，]/).map(s => s.trim()).filter(Boolean) || [];
            if (trimmed.includes('关键词')) keywordsZh = k;
            else keywordsEn = k;
        } else if (trimmed.startsWith('**Keyword:')) {
            keywordsEn = trimmed.split(/[:：]/)[1]?.split(/[;；,，]/).map(s => s.trim()).filter(Boolean) || [];
        }
    }

    if (!title && !abstractZh && !abstractEn) {
        return null;
    }

    const id = title ? slugify(title) : `sg-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    return {
        id: id,
        title: { zh: title || '无标题', en: title || '' },
        authors: ['alun weng'],
        date: new Date().toISOString().split('T')[0],
        journal: 'LAJI JOURNAL',
        volume: '1',
        issue: '1',
        doi: 'N/A',
        category: 'Economy & Society',
        keywords: { zh: keywordsZh, en: keywordsEn },
        abstract: { zh: abstractZh.trim(), en: abstractEn.trim() },
        content: { zh: content, en: '' }
    };
}

async function convertMdToPdf(mdPath: string): Promise<string> {
    const pdfPath = mdPath.replace(/\.md$/i, '.pdf');
    let content = fs.readFileSync(mdPath, 'utf-8');

    // Pre-process citations: convert [[doc_refer_1]] to <sup>[1]</sup>
    content = content.replace(/\[\[doc_refer_(\d+)\]\]/g, '<sup style="color: inherit; font-weight: normal;">[$1]</sup>');

    // Add (AI生成) at the end if not present
    if (!content.trim().endsWith('(AI生成)')) {
        content = content.trim() + '\n\n(AI生成)';
    }

    console.log(`Converting ${mdPath} to ${pdfPath}...`);
    try {
        const pdf = await mdToPdf({ content: content }, {
            css: `
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
                    line-height: 1.6; 
                    color: #000; 
                    max-width: 900px;
                    margin: 0 auto;
                    padding: 60px;
                    font-size: 15px;
                }
                h1, h2, h3, h4 { 
                    color: #000; 
                    font-weight: bold; 
                    margin-top: 2em; 
                    margin-bottom: 1em;
                }
                h3 { 
                    font-size: 24px; 
                    margin-bottom: 30px; 
                }
                h4 { 
                    font-size: 18px; 
                    margin-top: 1.5em;
                }
                h5 {
                    font-size: 16px;
                    margin-top: 1.2em;
                    font-weight: bold;
                }
                p { 
                    margin-bottom: 1em; 
                    text-align: justify;
                    text-indent: 0; /* Reference doesn't use indentation */
                }
                .abstract-box { 
                    margin: 20px 0;
                }
                strong { font-weight: bold; }
                code { background: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-family: monospace; }
                sup { vertical-align: super; font-size: 10px; margin-left: 1px; }
                @page { margin: 2cm; }
            `,
            pdf_options: {
                format: 'A4',
                printBackground: true
            }
        });
        if (pdf) {
            fs.writeFileSync(pdfPath, pdf.content);
            return pdfPath;
        }
    } catch (e) {
        console.error(`Failed to convert Markdown to PDF:`, e);
    }
    return '';
}

async function processFile(filePath: string, fileName: string, overrideObj?: Paper) {
    const ext = path.extname(fileName).toLowerCase();
    let textContent = '';

    console.log(`Processing file: ${fileName}`);

    try {
        if (ext === '.pdf') {
            textContent = await extractTextFromPDF(filePath);
        } else if (ext === '.docx' || ext === '.doc') {
            textContent = await extractTextFromDocx(filePath);
        } else if (ext === '.md') {
            textContent = fs.readFileSync(filePath, 'utf-8');
        } else {
            console.log(`Skipping unsupported file type: ${ext}`);
            return;
        }
    } catch (e) {
        console.error(`Failed to read file content for ${fileName}:`, e);
        return;
    }

    let generatedObj: Paper;

    if (overrideObj) {
        generatedObj = overrideObj;
        if (!generatedObj.id) {
            generatedObj.id = slugify(generatedObj.title.zh || fileName);
        }
    } else {
        // AI Logic
        const sampleText = textContent.slice(0, 15000);
        const prompt = `
        You are an academic paper metadata extraction tool for "Scholarly Garbage" (学术乐色). 
        Analyze the following paper text and extract its metadata into the specified JSON format.
        
        IMPORTANT RULES:
        1. If no authors are found, set "authors" to ["alun weng"].
        2. Ensure "zh" fields are in Chinese and "en" fields are in English.
        3. Output ONLY a valid minified JSON object.
    
        Structure required:
        {
          "id": "slug-id",
          "title": { "zh": "...", "en": "..." },
          "authors": ["Author 1"],
          "date": "YYYY-MM-DD",
          "journal": "Journal Name",
          "volume": "1",
          "issue": "1",
          "doi": "...",
          "category": "...",
          "keywords": { "zh": [], "en": [] },
          "abstract": { "zh": "...", "en": "..." },
          "content": { "zh": "...", "en": "..." }
        }
    
        Paper text:
        ${sampleText}
        `;

        try {
            console.log(`Calling Gemini API for ${fileName}...`);
            const response = await ai.models.generateContent({
                model: 'gemini-3.1-flash-lite-preview',
                contents: prompt,
            });
            await new Promise(resolve => setTimeout(resolve, 3000));

            let jsonStr = response.text || '';
            jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

            try {
                generatedObj = JSON.parse(jsonStr);
            } catch (e) {
                const start = jsonStr.indexOf('{');
                const end = jsonStr.lastIndexOf('}');
                generatedObj = JSON.parse(jsonStr.substring(start, end + 1));
            }
        } catch (e) {
            console.error(`AI Analysis failed for ${fileName}:`, e);
            return;
        }
    }

    // Common Fallbacks
    if (!generatedObj.authors || generatedObj.authors.length === 0) {
        generatedObj.authors = ['alun weng'];
    }
    if (!generatedObj.journal) {
        generatedObj.journal = 'LAJI JOURNAL';
    }
    if (!generatedObj.id) {
        generatedObj.id = `sg-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }

    // Add Random Metrics
    generatedObj.impactFactor = parseFloat((Math.random() * 9.99 + 0.01).toFixed(2));
    generatedObj.citations = Math.floor(Math.random() * 501);
    generatedObj.reviewScore = parseFloat((Math.random() * 9 + 1).toFixed(1));

    const journalFolder = slugify(generatedObj.journal);
    const destDir = path.join(outputBaseDir, journalFolder);

    if (!fs.existsSync(destDir)) {
        console.log(`Creating directory: ${destDir}`);
        fs.mkdirSync(destDir, { recursive: true });
    }

    // Write the .ts file
    let variableName = generatedObj.id.replace(/-/g, '').replace(/[^a-zA-Z0-9]/g, '');
    if (/^\d/.test(variableName)) {
        variableName = 'p' + variableName;
    }
    const tsContent = `import { Paper } from '${'../'.repeat(destDir.split(path.sep).filter(Boolean).length - rootDir.split(path.sep).filter(Boolean).length - 1)}types';
import pdfFile from './${path.basename(filePath)}';

export const ${variableName}: Paper = ${JSON.stringify(generatedObj, null, 4).replace(/"id":/, `"pdfUrl": pdfFile,\n    "id":`)};
`;
    const tsFilePath = path.join(destDir, `${generatedObj.id}.ts`);
    fs.writeFileSync(tsFilePath, tsContent, 'utf-8');
    console.log(`Created TS file: ${tsFilePath}`);

    // Move the original (PDF)
    const newFilePath = path.join(destDir, path.basename(filePath));
    fs.renameSync(filePath, newFilePath);
    console.log(`Moved file to: ${newFilePath}`);

    return {
        id: generatedObj.id,
        variableName: variableName,
        journalFolder: journalFolder,
        title: generatedObj.title.zh || generatedObj.title.en,
        files: [tsFilePath, newFilePath]
    };
}

function gitCommitAndPush(paperTitle: string, filePaths: string[]) {
    try {
        console.log(`Committing and pushing changes for: ${paperTitle}`);
        // Add specific files
        filePaths.forEach(fp => {
            execSync(`git add "${fp}"`, { stdio: 'inherit' });
        });

        // Add updated registry
        execSync(`git add src/data/papers.ts`, { stdio: 'inherit' });

        const commitMsg = `feat(content): add new paper - ${paperTitle}`;
        execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });

        // Push with proxy-safe flags
        console.log('Pushing to remote...');
        execSync(`git -c http.proxy= -c https.proxy= push`, { stdio: 'inherit' });
        console.log('Successfully pushed to GitHub.');
    } catch (e) {
        console.error('Git automation failed:', e);
    }
}

async function updatePapersRegistry(newImports: Array<{ id: string, variableName: string, journalFolder: string }>) {
    if (newImports.length === 0) return;

    const registryPath = path.join(rootDir, 'src', 'data', 'papers.ts');
    let registryContent = fs.existsSync(registryPath) ? fs.readFileSync(registryPath, 'utf-8') : '';

    newImports.forEach((item) => {
        const importStatement = `import { ${item.variableName} } from './papers/${item.journalFolder}/${item.id}';`;

        if (!registryContent.includes(importStatement)) {
            registryContent = registryContent.replace(
                'export const papers: Paper[] = [',
                `${importStatement}\n\nexport const papers: Paper[] = [`
            );
        }

        if (!registryContent.includes(`  ${item.variableName},`)) {
            registryContent = registryContent.replace(
                'export const papers: Paper[] = [',
                `export const papers: Paper[] = [\n  ${item.variableName},`
            );
        }
    });

    fs.writeFileSync(registryPath, registryContent, 'utf-8');
    console.log('Updated src/data/papers.ts');
}

async function main() {
    if (!fs.existsSync(unknownPapersDir)) {
        console.log('No unknown papers directory found.');
        return;
    }

    const files = fs.readdirSync(unknownPapersDir);
    const successfullyProcessed = [];

    for (let file of files) {
        if (file.startsWith('.')) continue;

        let filePath = path.join(unknownPapersDir, file);
        const ext = path.extname(file).toLowerCase();

        if (ext === '.md') {
            console.log(`Processing Markdown file: ${file}`);
            const mdContent = fs.readFileSync(filePath, 'utf-8');
            const manualObj = parseMdManual(mdContent);
            if (!manualObj) {
                console.log(`Skipping invalid/empty Markdown file: ${file}`);
                continue;
            }
            const pdfPath = await convertMdToPdf(filePath);
            if (pdfPath) {
                const pdfFileName = path.basename(pdfPath);
                // Process the PDF but use the manually extracted MD metadata
                const res = await processFile(pdfPath, pdfFileName, manualObj);
                if (res) {
                    // Move the original MD file to the same journal folder
                    const journalFolder = res.journalFolder;
                    const destDir = path.join(outputBaseDir, journalFolder);
                    const newMdPath = path.join(destDir, file);
                    fs.renameSync(filePath, newMdPath);
                    console.log(`Moved original MD to: ${newMdPath}`);

                    // Add MD to the files list for git
                    res.files.push(newMdPath);
                    successfullyProcessed.push(res);
                }
            }
        } else if (ext === '.pdf') {
            console.log(`Processing standalone PDF file: ${file}`);
            const res = await processFile(filePath, file);
            if (res) {
                successfullyProcessed.push(res);
            }
        }
    }

    if (successfullyProcessed.length > 0) {
        await updatePapersRegistry(successfullyProcessed);

        // Commit and push each processed paper
        for (const res of successfullyProcessed) {
            gitCommitAndPush(res.title, res.files);
        }

        console.log(`Finished processing and pushing ${successfullyProcessed.length} papers.`);
    }
}

main();
