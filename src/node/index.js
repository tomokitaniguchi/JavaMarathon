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

app.get("/customers", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.send(customerData.rows);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

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

app.use(express.json());

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
