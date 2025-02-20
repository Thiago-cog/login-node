import { useState, useEffect } from "react";
import investmentsServices from "../../services/investmentsServices";
import authServices from "../../services/authServices";
import GetCookie from "../../hooks/getCookie";
import { X } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import SaveButton from "../button/saveButton";
import 'react-toastify/dist/ReactToastify.css';

function Modal({ isOpen, setOpenToModal, stock, quoteValue }) {
    const [listWallets, setListWallets] = useState([]);
    const [listTypeInvestments, setListTypeInvestments] = useState([]);
    const [valueQuantity, setValueQuantity] = useState(1);
    const [totalValue, setTotalValue] = useState(1);
    const [walletId, setWalletId] = useState(null);
    const [typeInvestmentId, setTypeInvestmentId] = useState(null);
    const [localQuoteValue, setLocalQuoteValue] = useState(quoteValue);
    const [localStockValue, setLocalStockValue] = useState(stock);

    const token = GetCookie("user_session");

    async function getWallets() {

        setLocalQuoteValue(quoteValue);
        setTotalValue((quoteValue * valueQuantity).toFixed(2));

        const decodeToken = await authServices.decodeToken(token);
        const userId = decodeToken.userToken.id;
        const resultWallets = await investmentsServices.getAllWalletsByUserId(token, userId);
        const resultTypeInvestments = await investmentsServices.getTypeInvestments(token);
        const selectObject = { "id": 0, "name": "Selecione" };

        resultWallets.unshift(selectObject);
        resultTypeInvestments.unshift(selectObject);
        setListWallets(resultWallets);
        setListTypeInvestments(resultTypeInvestments);
    }

    async function getStockByTicker(ticker) {
        if (ticker) {
            const resultStock = await investmentsServices.getStocks(ticker);
            const marketPrice = resultStock[0]?.regularMarketPrice;
            setLocalStockValue(ticker);
            setLocalQuoteValue(marketPrice?.toFixed(2));
            setTotalValue((marketPrice * valueQuantity).toFixed(2));
        }
    }

    function setQuantity(quantity) {
        setValueQuantity(quantity);
        const totalValue = localQuoteValue * quantity;
        setTotalValue(totalValue.toFixed(2));
    }

    function setWalletIdSelect(e) {
        let walletId = e.target.value;
        setWalletId(walletId);
    }

    function setTypeInvestmentIdSelect(e) {
        let typeInvestmentId = e.target.value;
        setTypeInvestmentId(typeInvestmentId);
    }

    const handleSave = async (e) => {
        const quoteData = {
            walletId: parseInt(walletId),
            typeInvestments: parseInt(typeInvestmentId),
            stock: localStockValue,
            quantity: parseInt(valueQuantity),
            quoteValue: parseFloat(totalValue)
        };

        const resultAddQuote = await investmentsServices.addQuote(token, quoteData);

        if (resultAddQuote?.status === 400) {
            toast.info(`${resultAddQuote?.data?.message}`, {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else if (resultAddQuote?.status === 500) {
            toast.error('Internal Server Error!', {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        } else {
            toast.success(`${resultAddQuote?.data?.message}`, {
                position: "top-center",
                autoClose: 2500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    useEffect(() => {
        getWallets();
        setQuantity(1);
    }, [isOpen]);

    useEffect(() => {
        setLocalQuoteValue(quoteValue);
    }, [quoteValue]);
    useEffect(() => {
        setLocalStockValue(stock);
    }, [stock]);
    if (isOpen) {
        return (
            <>
                <ToastContainer />
                <div className="fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center">
                    <div className="relative bg-white rounded-lg p-8 w-full max-w-2xl mx-auto shadow-lg">
                        <button className="absolute top-3 right-3 hover:bg-gray-200 rounded-lg p-2" onClick={() => setOpenToModal(!isOpen)}>
                            <X className="w-6 h-6" />
                        </button>
                        <div className="mb-4">
                            <h1 className="text-2xl font-sans font-bold">Adicionar Ativo</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label>Carteiras</label>
                                <select className="border-gray-300 w-full h-14 rounded-lg outline-none focus:bg-gray-50 cursor-pointer" onChange={setWalletIdSelect} value={walletId}>
                                    {listWallets.map((wallet, index) => (
                                        <option key={index} className="rounded p-3 text-lg leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded" value={wallet.id}>{wallet.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Ticker</label>
                                <input type="text" defaultValue={localStockValue} onBlur={(e) => getStockByTicker(e.target.value)} className="rounded-lg border-gray-300 w-full h-14" />
                            </div>
                            <div>
                                <label>Cotação em R$</label>
                                <input type="text" value={localQuoteValue} disabled className="rounded-lg border-gray-300 w-full h-14 bg-gray-100" />
                            </div>
                            <div className="mb-4">
                                <label>Tipo do ativo</label>
                                <select className="border-gray-300 w-full h-14 rounded-lg outline-none focus:bg-gray-50 cursor-pointer" onChange={setTypeInvestmentIdSelect} value={typeInvestmentId}>
                                    {listTypeInvestments.map((typeInvestment, index) => (
                                        <option key={index} className="rounded p-3 text-lg leading-none text-gray-600 cursor-pointer hover:bg-indigo-100 hover:font-medium hover:text-indigo-700 hover:rounded" value={typeInvestment.id}>{typeInvestment.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label>Quantidade</label>
                                <input type="text" onChange={(e) => setQuantity(e.target.value)} value={valueQuantity} className="rounded-lg border-gray-300 w-full h-14" />
                            </div>
                            <div className="mb-4">
                                <label>Valor Total em R$</label>
                                <input type="text" value={totalValue} disabled className="rounded-lg border-gray-300 w-full h-14 bg-gray-100" />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <SaveButton functionButton={handleSave} text='Salvar' />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return null;
}

export default Modal;
