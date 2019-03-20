$(document).ready(function () {
	
	var mainElement = document.getElementById('itemPage'); // select the 
	loadShoppingCart();  // loads and displays existing data

	// to calculate the cost of item
	
	$("#quantity,#unitPrice").change(function () { // the function to run when the change event occurs for the selected elements
		var quantity = $("#quantity").val(); // Set the value attribute for input element of the  item quantity and assign a variable to it 
		var unitPrice = $("#unitPrice").val();// Set the value attribute for input element of the  item unit price and assign a variable to it 
			var itemCost;  // declare the variable for the item cost 
			 itemCost = parseFloat(quantity) * parseFloat(unitPrice); // calculate 
			$("#cost").val(itemCost); // discla
		})
	

//	this function calculate the subtotal , shipping, tax and total cost of items in the cart  
	function calculateTotalCost() {
		var itemsStored = localStorage.getItem('cartItems');
		var subtotal=0; // declare the sutotal variable 
		var shipping=0 ;// declare the shipping variable 
		var tax = 0; //declare tax
		var total = 0; // declare the total cost 

		if (itemsStored) {
			var cartItems = JSON.parse(itemsStored);// convert the itemstored from JSON string to a javascript object
			$.each(cartItems, function (index, cartInfo) { //for each row of the cart Items data 

				subtotal += Number(cartInfo.cost);// calculate the value of the cost and add to the subtotal
				shipping = subtotal * 0.065; // calcutale the shipping cost 
				tax = 0.11 * (subtotal + shipping);// calculate the tax 
				total = subtotal + shipping + tax;// calculate the total cost of the items in the shopping cart
				

				localStorage.setItem('cartItems', JSON.stringify(cartItems));//converting the cartItems object to a JSON string to allow web storage

			});
	    //select each output element  and display the values
		//use toFixed() for round the values to 2 decimal place
			$("#subTotal").val(subtotal.toFixed(2));
			$("#shipping").val(shipping.toFixed(2));
			$("#tax").val(tax.toFixed(2));
			$("#total").val(total.toFixed(2));
        }
	
		
	}
	
	
	
	// function below loads the data from existing data 

	function loadShoppingCart() {
		var itemsStored = localStorage.getItem('cartItems');
		if (itemsStored) {
			cartItems = JSON.parse(itemsStored);// convert the cartItemstored from JSON string to a javascript object
			$.each(cartItems, function (index, cartInfo) {   // specifies a function to run for each matched element 
				var row = $('<tr>');
				var html = '<td>' + cartInfo.itemID + '</td>' +
						   '<td>' + cartInfo.itemName + '</td>' +
						   '<td>' + cartInfo.description + '</td>' +
						   '<td>' + cartInfo.quantity + '</td>' +
						   '<td>' + cartInfo.unitPrice + '</td>' +
						   '<td>' + cartInfo.cost + '</td>' +
						   '<td><a class="delete" href="#">delete</a></td>';

				row.data().itemId = cartInfo.id; //assigning the unique ID of each data row 

				row.append(html); // 
				$(mainElement).find('table tbody').append(row); // finds the current data , updates and displays
				
			});
			
			calculateTotalCost();// call the calculateTotalCost method 
		}
	}

	function serializeForm() {
		var inputFields = $(mainElement).find('form :input');
		var result = {};
		$.each(inputFields, function (index, value) {
			if ($(value).attr('name')) {   
				result[$(value).attr('name')] = $(value).val();
			}
		});
		return result;
	}

// to store the data on the local storage 
	function store(cartInfo) {
		var itemsStored = localStorage.getItem('cartItems'); //select the 
		var cartItems = []; // declare a cart array 
		if (itemsStored) {
			cartItems = JSON.parse(itemsStored); // convert the cartItemstored from JSON string to a javascript object
		}
		cartItems.push(cartInfo);
		localStorage.setItem('cartItems', JSON.stringify(cartItems));//converting the cartInfo object to a JSON string to allow web storage

		
	}



	// this function saves the data o
	function savecartInfo() {
		
		var cartInfo = serializeForm();
		cartInfo.id = $.now();
		var row = $('<tr>');
		var html = '<td>' + cartInfo.itemID + '</td>' +
				   '<td>' + cartInfo.itemName + '</td>' +
				   '<td>' + cartInfo.description + '</td>' +
				   '<td>' + cartInfo.quantity + '</td>' +
				   '<td>' + cartInfo.unitPrice + '</td>' +
				   '<td>' + cartInfo.cost + '</td>' +
				   '<td>' + '<a class="delete" href="#">delete</a>' + '</td>';
		row.data().itemId = cartInfo.id;
		row.append(html);
		store(cartInfo);
		$(mainElement).find('table tbody').append(row);

		$(mainElement).find('form :input[name]').val('');
		
	}

	// this function delete items 
	function deletecartInfo(evt) {
		var itemId = $(evt.target).parents('tr').data().itemId;
		var cartItems = JSON.parse(localStorage.getItem('cartItems'));
		var newcartItems = cartItems.filter(function (c) {
			return c.id != itemId;
		});
		localStorage.setItem('cartItems', JSON.stringify(newcartItems));
		$(evt.target).parents('tr').remove(); // remove the parent row 
		calculateTotalCost();// calculate the total cost 
		
	}

// this function clears all the data from the local storage when the empty cart is clicked
//select the main element find and remove body of the table 
//reload the webpage
//refresh the webpage
	$(mainElement).find("input.emptyCart").click(
                function (evt) {
                	evt.preventDefault();// this stops the default action of an empty cart input element from happening
					
                	localStorage.clear();      // this clears the data stored on the local storage of your web page          	 
                	$(mainElement).find('table tbody').empty();  // finds the table body and removes all child nodes and content from the selected elements.             	
                	loadShoppingCart();          // loads and displays existing data      	 
                	location.reload();  // refershes the webpage 

                }
            );

/// this function clears all the data from the local storage when the delete is clicked
	$(mainElement).on("click", "a.delete", // select the main element and add a click event to the delete element 
				function (evt) {
					evt.preventDefault(); //this stops the default action of an empty cart input element from happening
					
					deletecartInfo(evt);// calls the delete cart method 
					
				}
);

// when the submit button is clicked it saves the data and calculate the shipping cost
	$(mainElement).find('form input[type="submit"]').click(// find the submit input element and fires the click event  
		 function (evt) {
		 	evt.preventDefault();
			if ($(evt.target).parents('form')[0].checkValidity()){ // check for the input validation before saving the shopping cart infomation
		   savecartInfo();// call the save function 
		 calculateTotalCost(); // calculate the total cost
			}
		 	 
		 	
		 });

	// this check for the validity of the date input 
	var date = document.getElementById('invoiceDate')
	date.oninvalid = function (e) {
		e.target.setCustomValidity("");
		if (e.target.validity.valid == false) {
			if (e.target.value.length == 0) {
				e.target.setCustomValidity("Invoice date is required.");
			} else {
				e.target.setCustomValidity("Please enter a valid Date .");
			}
		}
	};

	// this check for the validity of the item id input field
	var itemID = document.getElementById('itemID');
	itemID.oninvalid = function (e) {
		e.target.setCustomValidity("");
		if (e.target.validity.valid = false) {
			if (e.target.value.length == 0) {
				e.target.setCustomValidity("Item Id is required");
			}
			else if (!e.target.value.length==8) {
				e.target.setCustomValidity("Item Id must be exactly 8 characters.");
			}
			
		}
	};
	
	// this check for the validity of the item name input field
	
	var itemName = document.getElementById('itemName')
	      itemName.oninvalid = function (e) {
	            e.target.setCustomValidity("");
	           if (e.target.validity.valid == false) {
	               if (e.target.value.length == 0) {
	               	   e.target.setCustomValidity("Contact name is required.");
		           } else if (e.target.value.length < 5) {
			           e.target.setCustomValidity("Item name must be at least 5 characters."); 
		           }
		           else if (e.target.value.length > 25) {
		           	e.target.setCustomValidity("Item name permits maximum of 25 characters.");
		           }
	           }
            };

	// this check for the validity of the discription input field  
	      var description = document.getElementById('description')
	      description.oninvalid = function (e) {
	        e.target.setCustomValidity("");
	      if (e.target.validity.valid == false) {
	           if (e.target.value.length == 0) {
	           	e.target.setCustomValidity("Item description is required.");
	           } else if (e.target.value.length >300) {
	           	e.target.setCustomValidity("Item description permits maximum of 300 characters.");
	           }
	       }
	      };

	// this check for the validity of the quantity input field
	      var quantity = document.getElementById('quantity')
	      quantity.oninvalid = function (e) {
	      	e.target.setCustomValidity("");
	      	if (e.target.validity.valid == false) {
	      		if (e.target.value.length == 0) {
	      			e.target.setCustomValidity("Item quantity is required.");
	      		} else if (e.target.value< 1) {
	      			e.target.setCustomValidity("Item quantity permits minimum of 1 quantity.");
	      		}
	      	}
	      };
	// this check for the validity of the unit Price input field
	      var unitPrice = document.getElementById('unitPrice')
	      unitPrice.oninvalid = function (e) {
	      	e.target.setCustomValidity("");
	      	if (e.target.validity.valid == false) {
	      		if (e.target.value.length == 0) {
	      			e.target.setCustomValidity("Item unit rice is required.");
	      		} else if (e.target.value<0.01) {
	      			e.target.setCustomValidity("Item Item unit rice permits minimum of 1 cent ");
	      		}
	      	}
	      };
	
});