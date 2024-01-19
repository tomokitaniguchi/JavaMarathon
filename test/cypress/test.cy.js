describe('顧客情報入力フォームのテスト', () => {
  it("HOME画面から顧客一覧画面への遷移を確認する", () => {
    cy.visit("/tomoki_taniguchi/customer/index.html");
    cy.wait(1000);
    cy.get('a[href="./list.html"]').click();
    cy.url().should('include', '/customer/list.html');
    cy.wait(3000);
  });

  it('顧客情報を入力し、確認画面に遷移後フォームを送信する', () => {
    cy.visit('/tomoki_taniguchi/customer/add.html'); // テスト対象のページにアクセス
    // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      const companyName = encodeURIComponent(data.companyName);
      const industry = encodeURIComponent(data.industry);
      const contact = encodeURIComponent(uniqueContactNumber);
      const location = encodeURIComponent(data.location);
      // パラメータを元にテスト対象のページにアクセス
      cy.visit(`/tomoki_taniguchi/customer/add-confirm.html?companyName=${companyName}&industry=${industry}&contact=${contact}&location=${location}`);
      });

      cy.window().then((win) => {
      // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
      });
   
      // フォームの送信
      cy.get('#customer-form').submit();
      cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');
      cy.wait(5000);
	  
      // フォームがリセットされたことを確認
      cy.get('#companyName').should('have.value', '');
      cy.get('#industry').should('have.value', '');
      cy.get('#contact').should('have.value', '');
      cy.get('#location').should('have.value', '');
      cy.wait(5000);
   });

  it("詳細画面に遷移後、削除ボタンで情報を削除する", () => {
    // リストから任意の顧客情報(削除対象)を選択し、詳細画面に遷移
    cy.visit("/tomoki_taniguchi/customer/list.html");
    cy.wait(1000);
    cy.contains('テスト').click();
    cy.url().should('include', '/customer/detail.html');
    cy.wait(1000);

    // 削除ボタンをクリックするコードを実行
    cy.get('#delete-form').submit();

    // confirmダイアログに対するスタブを作成し、確認を選択するようにする
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    cy.wait(5000);

  });
});
// describe('顧客情報入力フォームのテスト', () => {
//   it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
//     cy.visit('/nishi/customer/add.html'); // テスト対象のページにアクセス
//     cy.window().then((win) => {
//       // windowのalertをスタブ化し、エイリアスを設定
//       cy.stub(win, 'alert').as('alertStub');
//     });

//     // テストデータの読み込み
//     cy.fixture('customerData').then((data) => {
//       // フォームの入力フィールドにテストデータを入力
//       const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
//       cy.get('#companyName').type(data.companyName);
//       cy.get('#industry').type(data.industry);
//       cy.get('#contact').type(uniqueContactNumber);
//       cy.get('#location').type(data.location);
//     });

//     // フォームの送信
//     cy.get('#customer-form').submit();

//     cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');

//     // フォームがリセットされたことを確認
//     cy.get('#companyName').should('have.value', '');
//     cy.get('#industry').should('have.value', '');
//     cy.get('#contact').should('have.value', '');
//     cy.get('#location').should('have.value', '');
//     cy.wait(5000);
//   });
// });
