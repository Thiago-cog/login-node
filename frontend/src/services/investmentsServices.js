import axios from "axios";
const BASE_URL = "https://brapi.dev/api";
const token = "fsg3B6QgZs5DfEn86UYdgE";

class InvestmentsService {
    async getPriceByNameQuote(){

    }

    async getQuote(){
        try{
            const response = await axios.get(`${BASE_URL}/quote/KLBN11?token=${token}`);
            return response.data.results[0];
        }catch (error){
            return error.response;
        }
    }
     
    async getListActions() {
        try{
            const response = await axios.get(`${BASE_URL}/quote/list?token=${token}&sortBy=market_cap_basic&sortOrder=desc&type=stock&limit=14`);
            response.data.stocks.forEach(stock => {

                if (stock.market_cap >= 1e9) {
                    stock.market_cap = (stock.market_cap / 1e9).toFixed(1) + 'B';
                } else if (stock >= 1e6) {
                    stock.market_cap = (stock.market_cap / 1e6).toFixed(1) + 'M';
                } else {
                    stock.market_cap = stock.market_cap.toString();
                }
            });
            return response.data.stocks;
        }catch (error){
            return error.response;
        }
    }

    async getListFunds() {
        try{
            const response = await axios.get(`${BASE_URL}/quote/list?token=${token}&sortBy=change&sortOrder=desc&type=fund&limit=5`);

            response.data.stocks.forEach(stock => {
                const formatChange = stock.change.toFixed(2);
                stock.change = formatChange
            });
           
            return response.data.stocks;
        }catch (error){
            return error.response;
        }
    }

    async getListBDRs() {
        try{
            const response = await axios.get(`${BASE_URL}/quote/list?token=${token}&sortBy=volume&sortOrder=desc&type=bdr&limit=5`);

            response.data.stocks.forEach(stock => {
                if (stock.volume >= 1e6) {
                    stock.volume = (stock.volume / 1e6).toFixed(1) + 'M';
                }else if(stock.volume >= 1e5) {
                    stock.volume = (stock.volume / 1e5).toFixed(1) + 'K';
                }
                
            });
           
            return response.data.stocks;
        }catch (error){
            return error.response;
        }
    }
}

export default new InvestmentsService();