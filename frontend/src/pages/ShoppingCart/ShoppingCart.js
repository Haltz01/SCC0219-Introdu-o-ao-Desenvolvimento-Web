import React, { useState } from 'react';

import Cookies from 'universal-cookie';
import { useHistory } from 'react-router-dom';

import './ShoppingCart.css';
import HomeHeader from '../components/Headers/HomeHeader';
import Footer from '../components/Footer/Footer';


export default function ShoppingCart() {
	const cookies = new Cookies();
    let history = useHistory(); // used to redict user
	var [totalApagar, setTotalApagar] = useState(0);

	let goToAddressSel = (props) => {
		let userCookie = cookies.get("SESSION");

		window.purchaseCodes[userCookie] = "purchaseCodeExample";
		history.push('/buy/select-address/purchaseCodeExample');
	}

	let increase = (props) =>{
		let productID = props.target.parentNode.id;

		window.shoppingCart[productID].quantity += 1;
		props.target.parentNode.childNodes[0].value = window.shoppingCart[productID].quantity;
		setTotalApagar(totalApagar + window.shoppingCart[productID].price);
	}

	let decrease = (props) =>{
		let productID = props.target.parentNode.id;
		
		if(window.shoppingCart[productID].quantity > 0){
			window.shoppingCart[productID].quantity -= 1;
			props.target.parentNode.childNodes[0].value = window.shoppingCart[productID].quantity;
			setTotalApagar(totalApagar - window.shoppingCart[productID].price);
		}
	}

	let testCookie = "280E8410C4A05326EB815B577B05574FDFB4AE016C399ACF1B02CFE5C59D59FE"; // sha-256 -> ganeshtestlogin (used for testing)
	let activeUserSession = [ testCookie ];

	let shoppingCartComponent;
	let itensList = [];

	if (activeUserSession.includes(cookies.get("SESSION"))) {
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
	else {
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