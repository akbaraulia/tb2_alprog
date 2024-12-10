from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import psycopg2
from datetime import datetime, timezone, timedelta

app = FastAPI()

# Database connection
conn = psycopg2.connect(
    dbname="alprog_tb2",
    user="postgres",
    password="pass",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# CORS config nya
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # nge allow request dari FE
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    id: int
    name: str
    price: float
    image: str

class CartItem(BaseModel):
    item_id: int
    quantity: int

class CartHistoryItem(BaseModel):
    id: int
    item_id: int
    quantity: int
    purchase_date: str
    price: float
    name: str

@app.get("/items", response_model=List[Item])
def get_items():
    cursor.execute("SELECT * FROM items")
    items = cursor.fetchall()
    return [{"id": item[0], "name": item[1], "price": item[2], "image": item[3]} for item in items]

@app.post("/cart")
def add_to_cart(cart_item: CartItem):
    cursor.execute("INSERT INTO cart (item_id, quantity) VALUES (%s, %s)", (cart_item.item_id, cart_item.quantity))
    conn.commit()
    return {"message": "Item added to cart"}

@app.get("/cart", response_model=List[CartItem])
def get_cart():
    cursor.execute("SELECT * FROM cart")
    cart_items = cursor.fetchall()
    return [{"item_id": item[0], "quantity": item[1]} for item in cart_items]

@app.post("/cart/history")
def add_to_cart_history(cart_item: CartItem):
    cursor.execute("INSERT INTO cart_history (item_id, quantity, purchase_date) VALUES (%s, %s, %s)", (cart_item.item_id, cart_item.quantity, datetime.now(timezone.utc)))
    conn.commit()
    return {"message": "Item added to cart history"}

@app.get("/cart/history", response_model=List[CartHistoryItem])
def get_cart_history():
    cursor.execute("""
        SELECT ch.id, ch.item_id, ch.quantity, ch.purchase_date, i.price, i.name
        FROM cart_history ch
        JOIN items i ON ch.item_id = i.id
    """)
    cart_history_items = cursor.fetchall()
    return [{"id": item[0], "item_id": item[1], "quantity": item[2], "purchase_date": (item[3] + timedelta(hours=7)).strftime("%Y-%m-%d %H:%M:%S"), "price": item[4], "name": item[5]} for item in cart_history_items]