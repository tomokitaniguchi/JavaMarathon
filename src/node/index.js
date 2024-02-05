const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3449;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: 'user_3449', // PostgreSQLのユーザー名に置き換えてください
  host: 'db',
  database: 'crm_3449', // PostgreSQLのデータベース名に置き換えてください
  password: 'pass_3449', // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// 一覧表示画面の処理
app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers ORDER BY customer_id");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 新規顧客情報を登録する処理
app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name,industry,contact,location) VALUES ($1,$2,$3,$4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.use(express.static("public"));

// 詳細表示画面の処理
app.get("/customer/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId; // URL パラメータから customerId を取得
    const customerData = await pool.query(
      "SELECT customer_id, company_name, industry, contact, location, created_date, updated_date FROM customers WHERE customer_id = $1",
     [customerId]); // クエリの WHERE 句に customerId を使用
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 顧客情報を削除する処理
app.delete("/delete/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId; // URL パラメータから customerId を取得
    const deleteCustomer = await pool.query(
      "DELETE FROM customers WHERE customer_id = $1",
      [customerId]);
    res.json({ success: true, customer: deleteCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客情報を変更する処理
app.post("/edit/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { companyName, industry, contact, location } = req.body;
    const deleteCustomer = await pool.query(
      "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4, updated_date = CURRENT_TIMESTAMP WHERE customer_id = $5",
      [companyName, industry, contact, location, customerId]);
    res.json({ success: true, customer: deleteCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 新規案件情報を登録する処理
app.post("/add-case", async (req, res) => {
  try {
    const { caseName, caseStatus, expectedRevenue, representative, customerId} = req.body;
    const newCase = await pool.query(
      "INSERT INTO cases (case_name,case_status,expected_revenue,representative,customer_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [caseName, caseStatus, expectedRevenue, representative, customerId]
    );
    res.json({ success: true, customer: newCase.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 案件一覧表示画面の処理
app.get("/cases/:customerId", async (req, res) => {
  try {
    const customerId = req.params.customerId; // URL パラメータから customerId を取得
    const caseData = await pool.query(
      "SELECT case_id, case_name, case_status, expected_revenue, representative FROM cases WHERE customer_id = $1 ORDER BY case_id",
    [customerId]
    ); // クエリの WHERE 句に customerId を使用
    res.send(caseData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 案件詳細表示画面の処理
app.get("/case/:caseId", async (req, res) => {
  try {
    const caseId = req.params.caseId; // URL パラメータから caseId を取得
    const caseData = await pool.query(
      "SELECT case_id, case_name, case_status, expected_revenue, representative, customer_id, created_date, updated_date FROM cases WHERE case_id = $1",
     [caseId]); // クエリの WHERE 句に caseId を使用
    res.send(caseData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 案件情報を削除する処理
app.delete("/deleteCase/:caseId", async (req, res) => {
  try {
    const caseId = req.params.caseId; 
    const deleteCase = await pool.query(
      "DELETE FROM cases WHERE case_id = $1",
      [caseId]);
    res.json({ success: true, customer: deleteCase.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 顧客情報を変更する処理
app.post("/editCase/:caseId", async (req, res) => {
  try {
    const { caseId } = req.params; 
    const { caseName, caseStatus, expectedRevenue, representative } = req.body;
    const updateCase = await pool.query(
      "UPDATE cases SET case_name = $1, case_status = $2, expected_revenue = $3, representative = $4, updated_date = CURRENT_TIMESTAMP WHERE case_id = $5",
      [caseName, caseStatus, expectedRevenue, representative, caseId]);
    res.json({ success: true, customer: updateCase.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 新規商談情報を登録する処理
app.post("/add-negotiation", async (req, res) => {
  try {
    const { negotiationDate, negotiationContent, negotiationConfidence, negotiationRepresentative, caseId} = req.body;
    const newCase = await pool.query(
      "INSERT INTO negotiations (negotiation_date,negotiation_content,negotiation_confidence,negotiation_representative,case_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [negotiationDate, negotiationContent, negotiationConfidence, negotiationRepresentative, caseId]
    );
    res.json({ success: true, customer: newCase.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 商談一覧表示画面の処理
app.get("/negotiations/:caseId", async (req, res) => {
  try {
    const caseId = req.params.caseId; 
    const caseData = await pool.query(
      "SELECT negotiation_id, negotiation_date, negotiation_content, negotiation_confidence, negotiation_representative FROM negotiations WHERE case_id = $1 ORDER BY negotiation_id",
    [caseId]
    ); // クエリの WHERE 句に customerId を使用
    res.send(caseData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 商談詳細表示画面の処理
app.get("/negotiation/:negotiationId", async (req, res) => {
  try {
    const negotiationId = req.params.negotiationId; 
    const negotiationData = await pool.query(
      "SELECT negotiation_id, negotiation_date, negotiation_content, negotiation_confidence, negotiation_representative, case_id, created_date, updated_date FROM negotiations WHERE negotiation_id = $1",
     [negotiationId]); // クエリの WHERE 句に negotiationId を使用
    res.send(negotiationData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// 商談情報を削除する処理
app.delete("/deleteNegotiation/:negotiationId", async (req, res) => {
  try {
    const negotiationId = req.params.negotiationId; 
    const deleteNegotiation = await pool.query(
      "DELETE FROM negotiations WHERE negotiation_id = $1",
      [negotiationId]);
    res.json({ success: true, customer: deleteNegotiation.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// 商談情報を変更する処理
app.post("/editNegotiation/:negotiationId", async (req, res) => {
  try {
    const { negotiationId } = req.params; 
    const { negotiationDate, negotiationContent, negotiationConfidence, negotiationRepresentative } = req.body;
    const updateNegotiation = await pool.query(
      "UPDATE negotiations SET negotiation_date = $1, negotiation_content = $2, negotiation_confidence = $3, negotiation_representative = $4, updated_date = CURRENT_TIMESTAMP WHERE negotiation_id = $5",
      [negotiationDate, negotiationContent, negotiationConfidence, negotiationRepresentative, negotiationId]);
    res.json({ success: true, customer: updateNegotiation.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});