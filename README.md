# online-shopping

This is a command line node application that will simulate online shopping (think of Amazon).  You can use the application as a Customer or as a Manager.  The inventory containing the products for sale is stored on a MySQL database and as a Manager/Customer, the transactions you make via the command line will run SQL statements to query, update, or add data to the database.  Essentially, this CLI app is a good starting ground for creating a system to run ecommerce transactions. 

This node application was created using NodeJS, JavaScript, MySQL, and NPM.  You will need to use your Terminal/Bash to make requests and retrieve responses. 

The creator of this application is azukimochi and she can be contacted via https://github.com/azukimochi.

### Using the Application as a Customer

1. Ensure you *git clone* the repository.  If an inventory has not been created yet, reference the *bamazon_schema.sql* file to create the database and table that will be used with MySQL.  This will contain the data that you will be querying.  Use your terminal/bash to *cd* into the directory.  Then, to run the file, you will need to input *node bamazonCustomer.js*.

![](https://azukimochi.github.io/online-shopping/images/screenshot_1.png)

2. You will then be connected as indicated by the connection id that is logged in your terminal/bash.  All of the products in the inventory will be logged as well.  Their IDs, names, departments, and prices will be logged.  You will then be prompted to type in the ID of the product you want to purchase. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_2.png)

3. If you input an ID that is not a number, there will be no response.  If you input an ID that is a number but does not exist in the inventory, a message will be logged, telling you that it does not exist.  You will then be prompted to input another ID. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_3.png)

When you input an ID that does exist in the inventory, the product associated with that ID will have its ID, name, department, and price logged in the terminal/bash.  You will then be prompted to input the number of units that you would like to purchase. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_4.png)

4. If you input a value that is not a number, there will be no response.  If you input a number, the application will check to see if there are enough units of that product in stock for you.  If there are enough units, your purchase will be processed.  The inventory will be updated to reflect the new stock quantity for that product *(eg. The stock_quantity for Kit-Kats goes down from 8 to 7 because you've purchased 1 unit).*

![](https://azukimochi.github.io/online-shopping/images/screenshot_5.png)

If there are not enough units of the requested product in stock, then a message will be logged in the terminal/bash.  This message will tell you that there is insufficient stock.  The current stock quantity will also be logged for your reference.  You will then be prompted to either make another purchase request or to exit the application.  

![](https://azukimochi.github.io/online-shopping/images/screenshot_6.png)

If you choose to exit the application, *"Goodbye, come again!"* will be logged in your terminal/bash and your connection will end. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_7.png)

### Using the Application as a Manager

1. Ensure you *git clone* the repository.  If an inventory has not been created yet, reference the *bamazon_schema.sql* file to create the database and table that will be used with MySQL.  This will contain the data that you will be querying.  Use your terminal/bash to *cd* into the directory.  Then, to run the file, you will need to input *node bamazonManager.js*.

![](https://azukimochi.github.io/online-shopping/images/screenshot_8.png)

2. You will then be connected as indicated by the connection id that is logged in your terminal/bash.  A menu will appear in your terminal/bash.  It will prompt you to choose one of four activities:

    *A) View Products for Sale 
    B) View Low Inventory
    C) Add to Inventory
    D) Add New Product*

![](https://azukimochi.github.io/online-shopping/images/screenshot_9.png)

##### View Products for Sale

All of the products in the inventory will be logged in your terminal/bash.  Their IDs, names, departments, prices, and stock quantities will be logged.  You will then be prompted to either go back to the menu or to exit the application.  

![](https://azukimochi.github.io/online-shopping/images/screenshot_10.png)

Below is an example of what it will look like if you go back to the menu. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_11.png)

If you choose to exit the application instead, *"Goodbye, come again!"* will be logged in your terminal/bash and your connection will end. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_12.png)

##### View Low Inventory 

All of the products with fewer than 5 units in stock will be logged in your terminal/bash.  Their IDs, names, departments, prices, and stock quantities will be logged.  You will then be prompted to either go back to the menu or to exit the application.  

![](https://azukimochi.github.io/online-shopping/images/screenshot_13.png)

##### Add to Inventory 

All of the products on sale will be logged in your terminal/bash. Their IDs, names, departments, prices, and stock quantities will be logged.  You will then be prompted to input the ID of the product to which you want to add more units. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_14.png)

If you input an ID that is not a number, there will be no response.  If you input an ID that is a number but does not exist in the inventory, a message will be logged, telling you that it does not exist.  You will then be prompted to input another ID. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_15.png)

When you input an ID that does exist in the inventory, the product associated with that ID will have its ID, name, department, price, and stock quantity logged in the terminal/bash.  You will then be prompted to input the number of units that you would like to add. 

![](https://azukimochi.github.io/online-shopping/images/screenshot_16.png)

If you input a value that is not a number, there will be no response.  When you input a number, the application will process the addition of the units you have indicated.  The ID, stock quantity before the addition, number of requested units, and the new stock quantity will be logged in your terminal/bash. The inventory in the database will be updated to reflect the new stock quantity of the product.  You will then be prompted to either go back to the menu or to exit the application.  

![](https://azukimochi.github.io/online-shopping/images/screenshot_17.png)

##### Add New Product 

You will be prompted to input the name, department, price, and stock quantity of the product that you would like to add into the inventory.  If the request is successful, *"The product has been added into the inventory!"* will be logged in your terminal/bash and the inventory in the database will be updated to reflect the addition of the new product.  You will then be prompted to either go back to the menu or to exit the application.  

![](https://azukimochi.github.io/online-shopping/images/screenshot_18.png)






