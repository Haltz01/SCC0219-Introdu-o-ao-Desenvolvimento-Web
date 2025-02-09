import React, { useState } from 'react';

import Cookies from 'universal-cookie'; // used for testing
import { useHistory } from 'react-router-dom';

import './ShoppingCart.css';
import HomeHeader from '../components/Headers/HomeHeader';
import Footer from '../components/Footer/Footer';


export default function ShoppingCart() {
	const cookies = new Cookies();
    let history = useHistory(); // used to redict user

	const [ isLogged, setIsLogged ] = useState(false);
    const [ done, setDone ] = useState(false);
	
	var [totalApagar, setTotalApagar] = useState(0); // total price of all products in the cart

	// Moves to next page needed in the flow of buying a product (selecting an address)
	let goToAddressSel = () => {
		let userCookie = cookies.get("SESSION");

		window.purchaseCodes[userCookie] = "purchaseCodeExample"; // hardcoded for now. This will be defined by the backend later
		history.push('/buy/select-address/purchaseCodeExample');
	}

	// Function that increases the quantity of an item in the user's shopping cart
	let increase = async (props) =>{
		let productID = props.target.parentNode.id;

		let quantityProdAvaible = await fetch(window.BACKEND_URL + '/products/info/' + window.shoppingCart[productID].slug);
		quantityProdAvaible = (await quantityProdAvaible.json()).quantity;
		console.log(quantityProdAvaible);

		window.shoppingCart[productID].quantity += 1;
		if(window.shoppingCart[productID].quantity >= quantityProdAvaible)
		{
			window.shoppingCart[productID].quantity = quantityProdAvaible;
		}
		props.target.parentNode.childNodes[0].value = window.shoppingCart[productID].quantity;
		setTotalApagar(totalApagar + window.shoppingCart[productID].price);
	}

	// Function that decreases the quantity of an item in the user's shopping cart
	let decrease = (props) =>{
		let productID = props.target.parentNode.id;
		
		if(window.shoppingCart[productID].quantity > 0){
			window.shoppingCart[productID].quantity -= 1;
			props.target.parentNode.childNodes[0].value = window.shoppingCart[productID].quantity;
			setTotalApagar(totalApagar - window.shoppingCart[productID].price);
		}
	}

	var checkIfLogged = async () => {
		if (isLogged)
			return true;
        
		let sessionCookie = cookies.get("ADMIN_SESSION");
		if (sessionCookie == null)
			sessionCookie = cookies.get("SESSION");

        let resp = await fetch(window.BACKEND_URL + '/user/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': sessionCookie
            }
        });

        resp = await resp.json();

        if (resp.token_status === "OK")
            return true;
        else
            return false;
    };

    if (!isLogged && !done) {
		checkIfLogged().then((res) => {
            setIsLogged(res);
            setDone(true);
        });
    }

	let shoppingCartComponent; // component that will contain the main elements of the shopping cart page (if user is logged in)
	let itensList = []; // list of divs containing the itens from the user's shopping cart

	// If user is logged in, he/she has a shopping cart and the itens from it can be loaded into the page
	if (!done || isLogged) {
		totalApagar = 0;
		for (const [prodName, prodDetails] of Object.entries(window.shoppingCart)) {
			itensList.push( <div key={"div_"+prodName} className="row">
				<div className="col-3 p-3 atributteDisplay justify-content-center"> {prodDetails.prodName} </div>
				<div className="col-3 p-3 atributteDisplay justify-content-center" id={prodName}>
					<input className="Quantity" id="inputGroup-sizing-sm" type="number" name="clicks" value={prodDetails.quantity} onChange={(event) => {}} /> 
					<button className="col btn" onClick={increase}>+</button>
					<button className="col btn" onClick={decrease}>-</button>
				</div>
				<div className="col-3 p-3 atributteDisplay justify-content-center"> R$ {prodDetails.price} </div>
				<div className="col-3 p-3 atributteDisplay justify-content-center"> R$ {prodDetails.price*prodDetails.quantity} </div></div> );

				totalApagar += prodDetails.price*prodDetails.quantity;
		}

		shoppingCartComponent = (
			<div>
				<div className="row d-flex justify-content-between py-4">
					<div className="col">
						<h1 className="shoppingCart text-center py-3 mb-3">Meu carrinho de compras</h1>
						<div className="row d-flex justify-content-evenly py-1 generalBox">
							<div className="col-3 p-3 atributteDisplay justify-content-center">
								Nome
							</div>
							<div className="col-3 p-3 atributteDisplay justify-content-center">
								Qtd
							</div>
							<div className="col-3 p-3 atributteDisplay justify-content-center">
								Preço
							</div>
							<div className="col-3 p-3 atributteDisplay justify-content-center">
								Total
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col shoppingCartItensList">
						{ itensList }
					</div>
				</div>
				<div className="row d-flex justify-content-end py-3">
					<div className="col-6 col-sm-6 col-md-5 col-lg-4 col-xl-3 totalPay py-4 text-left">Total a pagar:   R${totalApagar}</div>
				</div>
				<div className="row finishShop text-center ">
					<button className="col finishShopF py-3" onClick={goToAddressSel}>
						FINALIZAR COMPRA
					</button>
				</div>
			</div>
		);
	}
	else { // user is not logged in, he/she can't access this page
		shoppingCartComponent = (
			<h1> Usuário não logado </h1>
		);
		history.push("/login");
	}

    return (
        <div className="gradiantMainContainer">
            <HomeHeader />
            <div className="container p-4">
				{ shoppingCartComponent }
			</div>
			<Footer />
		</div>
    );
}