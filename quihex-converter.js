const fs = require('fs');
const moment = require('moment');
const shell = require('shelljs');
const TurndownService = require('turndown');
const toMdService = TurndownService();

// qvnotebook
let FROM = '';
// hexo
let TO = '';

// 初期処理 - hexoディレクトリ内にディレクトリを削除、作成
function initSource(TO) {
  const post = TO + '/_posts/quiver';
  const assets = TO + '/assets/quiver';
  shell.rm('-rf', post);
  shell.rm('-rf', assets);
  shell.mkdir(post);
  shell.mkdir(assets);
}

// ディレクトリ内のファイルを一覧化
function ls(path) {
  const files = fs.readdirSync(path);
  console.log("readdirSync: " + files)
  return files.map(file => {
    return path + '/' + file;
  })
}

// パスが存在するかどうかを確認
function hasDir(path) {
  return fs.existsSync(path);
}

// ディレクトリかどうかを確認
function isDir(path) {
  if (!hasDir(path)) return false;
  return fs.lstatSync(path).isDirectory();
}

// jsonファイルのパース処理
function readJSON(path) {
  // ファイルの読み込み
  const buffer = fs.readFileSync(path);
  // パース処理
  return JSON.parse(buffer.toString('utf8'));
}

// ノートの解析処理
function readNote(path) {
  const content = readJSON(path + '/content.json');
  // console.log(content);
  const meta = readJSON(path + '/meta.json');
  // console.log(meta);
  const note = {
    uuid: meta.uuid,
    title: meta.title.replace(/:/g, ' ') || 'no title',
    tags: meta.tags,
    date: moment.unix(meta.created_at).format('YYYY-MM-DD HH:mm:ss'),
    content: ''
  };

  // 解析 cells
  if (content.cells) {
    content.cells.map(function (cell) {
      if (cell.type === 'text') {
        let content = toMdService.turndown(cell.data) + '\n\n';
        content = content.replace(/ =\d+x\d+/g, '');
        note.content += content.replace(/quiver-image-url/g, '/assets/quiver');
      }
      if (cell.type === 'markdown') {
        let content = cell.data + '\n\n';
        content = content.replace(/ =\d+x\d+/g, '');
        note.content += content.replace(/quiver-image-url/g, '/assets/quiver');
      }
      if (cell.type === 'code') {
        note.content += '```' + cell.language + '\n' + cell.data + '\n```\n\n';
      }
    })
  }
  console.log(note)
  writeMd(note);
}

function writeMd(note) {
  const meta = `---\ntitle: ${note.title}\ndate: ${note.date}\ntags: ${JSON.stringify(note.tags)}\n---\n\n`;
  console.log(meta)
  fs.writeFileSync(`${TO}/_posts/quiver/${note.uuid}.md`, meta + note.content);
}

function writeRes(path) {
  const resPath = path + '/resources';
  if (isDir(resPath)) {
    const res = ls(resPath);
    if (res) {
      res.map(item => {
        shell.cp('-rf', item, TO + '/assets/quiver/');
      })
    }
  }
}

// 開始処理
function start() {
  if (process.argv.length !== 4) {
    console.log('引数を指定してください: node quiver2hexo.js quiver_qvnotebook_path hexo_source_path');
    process.exit(-1);
  }
  const args = process.argv.splice(2);
  FROM = args[0]
  TO = args[1]

  // 初期処理
  initSource(TO);

  // ノート・ファイル処理
  ls(FROM).map(function (notePath) {
    if (isDir(notePath)) {
      // console.log(notePath);
      // ディレクトリのみ処理される
      readNote(notePath);
      writeRes(notePath);
    }
  });
}

start();
