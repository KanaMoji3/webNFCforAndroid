//HTMLロード時実行にscanを行うことでAndroid本体からのNFC読み取りを防止する
window.addEventListener('load', async () => {
    const cardStatus = document.getElementById('cardStatus'); // カードの状態を表示する要素

    // NFCリーダーを有効化
    const ndef = new NDEFReader();

    // NFCリーダーがNFCタグを検出するのを待つ
    await ndef.scan();

    ndef.addEventListener('reading', () => {
        cardStatus.textContent = 'カードの状態：検出';
    });

    ndef.addEventListener('readingerror', (error) => {
        cardStatus.textContent = 'カードの状態：エラー ' + error.message;
    });
});



// クリックされたときにNFCタグに書き込む処理を実行
const writeButton = document.getElementById('writeButton');
writeButton.addEventListener('click', async () => {

    const writtenData = document.getElementById('writtenData'); // 書き込んだデータを表示する要素
    const url = document.getElementById('urlWriteID').value; // 入力されたテキストを取得
    const cardStatus = document.getElementById('cardStatus'); // カードの状態を表示する要素
    const protocolSelect = document.getElementById('protocolSelect').value; // プロトコルをセレクト要素の値から取得

    try {
        // プロトコルと入力されたテキストを結合してURLを作成
        const writeUrl = protocolSelect + url;

        // NFCリーダーを有効化
        const ndef = new NDEFReader();

        // 表示を「NFCカードをかざしてください」に変更
        cardStatus.textContent = 'NFCカードをかざしてください';

        // NFCリーダーがNFCタグを検出するのを待つ
        await ndef.scan();

        // 入力されたテキストをNFCタグに書き込む
        await ndef.write({
            records: [{ recordType: "url", data: writeUrl }], // 入力されたテキストをNFCタグに書き込む
        });
        // URLの形式はhttps://から書き始める必要がある。　例：https://www.google.com

        // 書き込んだデータを表示
        writtenData.textContent = '書き込んだデータ： ' + writeUrl;

        console.log('NFCタグにデータを書き込みました:', writeUrl);
    } catch (error) {
        // 表示を「NFCカードをかざしてください」に変更
        cardStatus.textContent = 'カードの状態：未検出';
        writtenData.textContent = '書き込み中にエラーが発生しました： ' + error;
        console.error('NFCタグへの書き込み中にエラーが発生しました:', error);
    }
});
