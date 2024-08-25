import { Database } from "bun:sqlite";

const db = new Database("bookstore.sqlite");

const createBook = (book: any) => {
  try {
    const query = db.query(
      "insert into books (title, author,price) values ($title, $author, $price)"
    );
    query.run({
      $title: book.title,
      $author: book.author,
      $price: book.price,
    });
    return { status: "success" , message: `เพิ่มหนังสือ ${book.title} เรียบร้อย` };
  } catch (error) {
    console.log("error", error);
    return { status: "error" };
  }
};

const getBooks = () => {
  try {
    const query = db.query("select * from books");
    return query.all();
  } catch (error) {
    console.log("error", error);
    return [];
  }
};

const getBook = (id: number) => {
  try {
    const query = db.query("select * from books where id = $id");
    const result = query.get({ $id: id });
    if (!result) {
      throw new Error("ไม่พบหนังสือ");
    }
    return { status: "success", data: result };
  } catch (error) {
    console.log("error", error);
    return { status: "error", message: error.message };
  }
};

const updateBook = async (book: any) => {
  try {
    const chekbook = await getBook(book.id);
    if (chekbook.status === "error") {
      throw new Error(chekbook.message);
    }
    const query = db.query(
      "update books set title = $title, author = $author, price = $price where id = $id"
    );
    query.run({
      $id: book.id,
      $title: book.title,
      $author: book.author,
      $price: book.price,
    });
    return { status: "success", message: `แก้ไขหนังสือ ${book.title} เรียบร้อย` };
  } catch (error) {
    console.log("error", error);
    return { status: "error", message: error.message };
  }
};

const deleteBook = (id: number) => {
  try {
    const query = db.query("delete from books where id = $id");
    query.run({ $id: id });
    return { status: "success" , message: `ลบหนังสือ id : ${id} เรียบร้อย` };
  } catch (error) {
    console.log("error", error);
    return { status: "error" };
  }
};

/* User --------------------   */

const createUser = (user: any) => {
  try {
    const query = db.query(
      "insert into users (email,password) values ( $email, $password)"
    );
    query.run({
      $email: user.email,
      $password: user.password,
    });
    return { status: "success" };
  } catch (error) {
    console.log("error", error);
    return { status: "error" };
  }
};

const getUser = (user: any) => {
  try {
    //สร้าง query
    const query = db.query(
      "select * from users where email = $email and password = $password"
    );
    // run query
    const result = query.get({
      $email: user.email,
      $password: user.password,
    });

    // ตรวจสอบ result
    if (!result) {
      throw new Error("ไม่พบผู้ใช้งาน");
    }

    // ส่งค่ากลับ
    return result;
  } catch (error: any) {
    // ตรวจสอบ error
    console.log("error", error);
    // ส่งค่ากลับ
    return { status: "error", message: error.message };
  }
};

export {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook,
  createUser,
  getUser,
};
