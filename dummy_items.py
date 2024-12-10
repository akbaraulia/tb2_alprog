import psycopg2

# Database connection
conn = psycopg2.connect(
    dbname="alprog_tb2",
    user="postgres",
    password="pass",
    host="localhost",
    port="5432"
)
cursor = conn.cursor()

# Delete existing data kalo emang ada
cursor.execute("DELETE FROM items")
conn.commit()

# Dummy item nya 
items = [
    {"name": "Dr. Martens 1460 HDW Polished", "price": 5799000, "image": "https://shop.r10s.jp/kicks-juicy/cabinet/drmartens/31592001.jpg"},
    {"name": "Dr. Martens 1460 Smooth", "price": 4599000, "image": "https://sko-uno.com/wp-content/uploads/2015/08/Dr-Martens-1460-Black-Smooth-7.jpg"},
    {"name": "Dr. Martens 1461 Smooth", "price": 3999000, "image": "https://th.bing.com/th/id/OIP.NBSU6vYZUrfdMBMu0JNYMgAAAA?rs=1&pid=ImgDetMain"},
    {"name": "Dr. Martens 2976 Smooth", "price": 4799000, "image": "https://th.bing.com/th/id/OIP.8q7e29rnuXbE-EA5NbjjyQAAAA?rs=1&pid=ImgDetMain"},
    {"name": "Dr. Martens 1460 Pascal", "price": 4999000, "image": "https://www.humphriesshoes.co.uk/images/products/large/9723.jpg"},
    {"name": "Dr. Martens 1460 Mono", "price": 4899000, "image": "https://th.bing.com/th/id/OIP.Z111Vd9yP1e_iBEmBQtAgQAAAA?rs=1&pid=ImgDetMain"},
    {"name": "Dr. Martens 1460 Vegan", "price": 5199000, "image": "https://i8.amplience.net/i/office/2261900000_md1.jpg?$newhighres$"},
    {"name": "Dr. Martens 1460 Bex", "price": 5399000, "image": "https://cdn.shopify.com/s/files/1/0076/6040/4818/products/1_ac4aa8c5-d42a-4bb3-8f22-b4f658a9694b_1040x.jpg?v=1619065011"},
    {"name": "Dr. Martens 1460 Patent", "price": 5499000, "image": "https://i1.adis.ws/i/drmartens/26886001.83.jpg?$medium$"},
    {"name": "Dr. Martens 1460 Crazy Horse", "price": 5599000, "image": "https://th.bing.com/th/id/OIP.rj1W7QgtGBQ3G-wTQM-W1gHaHa?w=1200&h=1200&rs=1&pid=ImgDetMain"},
    {"name": "Dr. Martens 1460 Pascal Virginia", "price": 5699000, "image": "https://th.bing.com/th/id/OIP.5vCLdCOAtI5ycFFOwfV3lwHaJQ?rs=1&pid=ImgDetMain"},
]

# Insert dummy item ke DB
for item in items:
    cursor.execute("INSERT INTO items (name, price, image) VALUES (%s, %s, %s)", (item['name'], item['price'], item['image']))
    conn.commit()

cursor.close()
conn.close()