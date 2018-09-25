プログラマー用ノートアプリ「Quiver」のデータを静的サイトジェネレータ「Hexo」のデータに変換するスクリプトです。

+ [Quiver](http://happenapps.com/)
+ [Hexo](https://hexo.io/)

## 使用方法

```bash
git clone https://github.com/uryonet/quiver-hexo-converter.git

cd quiver2hexo
npm install

node quihex-converter.js quiver_qvnotebook_path hexo_source_path
```

説明：

+ `quiver_qvnotebook_path`： Quiverのノートブックデータのパスを指定します。パスは次の方法で確認できます。 `変換したノートブックを右クリック` -> `Show in Finder`
+ `hexo_source_path`： hexoプロジェクトの`source`ディレクトリ

変換後のデータはそれぞれ以下に保存されます。
+ ドキュメント： `hexo_path/source/_post/quiver`
+ 画像： `hexo_path/source/assets/quiver`

**上記ディレクトリ内のデータはスクリプト実行にすべて消去されます**

`deploy.sh`を使用すると、変換からデプロイまで一貫して実行できます。

## ライセンス
このスクリプトは[MITライセンス](https://opensource.org/licenses/MIT)です。

