const jwt = require('jsonwebtoken');
const TypeInvestments = require('./entity/type-investments');

class InvestmentsMaintenance {
    constructor(walletsRepository, investmentsRepository, typeInvestmentsRepository) {
        this.walletsRepository = walletsRepository;
        this.investmentsRepository = investmentsRepository;
        this.typeInvestmentsRepository = typeInvestmentsRepository;
    }

    async decodeToken(token) {
        let result = {}
        try {
            if (!token) {
                result.status = 403
                result.errors = {
                    errors: 'Token não enviado',
                    message: "Token não identificado."
                }
                return result;
            }

            const decoded = jwt.verify(token, process.env.AUTH_SECRET);
            result.status = 200;
            result.data = decoded;
        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }
        return result;
    }

    async createWallet(walletData) {
        let result = {};
        try {
            if (!walletData.userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            await this.walletsRepository.createWallet(walletData);

            result.status = 200;
            result.data = {
                message: `Carteira: ${walletData.name} criada com sucesso.`
            };
        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }

        return result;
    }

    async addQuoteInWallet(quoteData) {
        let result = {};
        try {
            if (!quoteData.walletId) {
                result.status = 400;
                result.errors = {
                    errors: 'Carteira não encontrada',
                    message: "Não foi possível identificar a carteira."
                }
                return result;
            }

            await this.investmentsRepository.insertQuoteInWallet(quoteData);

            const typeInvestmentsName = this.#getTypeInvestments(quoteData.typeInvestments);
            result.status = 200;
            result.data = {
                message: `${typeInvestmentsName}: ${quoteData.stock} adicionada(o) a carteira com sucesso.`
            };
            return result;
        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
            return result;
        }
    }

    async getAllWalletsByUserId(userId) {
        let result = {};
        try {
            if (!userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            const listWallets = await this.walletsRepository.getAllWalletsByUserId(userId);
            result.data = listWallets;
            result.status = 200;
        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }

        return result;
    }

    async getTypeInvestments() {
        let result = {};
        try {
            const listTypeInvestments = await this.typeInvestmentsRepository.getTypeInvestments();
            result.data = listTypeInvestments;
            result.status = 200;
        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }

        return result;
    }

    async getAllWalletData(userId) {
        let result = {};
        try {
            if (!userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            const resultListActive = await this.investmentsRepository.getAllWalletData(userId);
            let listActive = {};
            let totalSum = 0;

            resultListActive.forEach(({ name_type, stock, total_quantity, total_value }) => {
                if (!listActive[name_type]) {
                    listActive[name_type] = {
                        name_type: name_type,
                        count: 0,
                        total: 0,
                        stocks: []
                    };
                }
                listActive[name_type].count++;
                listActive[name_type].total += total_value;
                listActive[name_type].stocks.push({
                    stock: stock,
                    name_type: name_type,
                    total_quantity: total_quantity,
                    total_value: total_value.toFixed(2)
                });
                totalSum += total_value;
            });

            Object.values(listActive).forEach(item => item.totalSum = totalSum.toFixed(2));

            const listActiveArray = Object.values(listActive);

            result.data = listActiveArray;
            result.status = 200;
            return result;

        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }

        return result;
    }

    async getAllStocksByUserId(userId) {
        let result = {};
        try {
            if (!userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            const resultListStocks = await this.investmentsRepository.getAllStocksByUserId(userId);

            let listActive = {};

            resultListStocks.forEach(({ name_type, total }) => {
                if (!listActive[name_type]) {
                    listActive[name_type] = {
                        name_type: name_type,
                        total: 0
                    };
                }
                listActive[name_type].total += parseFloat(total.toFixed(2));
            });

            const listActiveArray = Object.values(listActive);

            result.data = listActiveArray;
            result.status = 200;

        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }

        return result;
    }

    async getRankStocksByUserId(userId) {
        let result = {};
        try {
            if (!userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            const resultListRankStocks = await this.investmentsRepository.getRankStocksByUserId(userId);
            
            result.data = resultListRankStocks;
            result.status = 200;

        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }
        
        return result;
    }

    async validatesWallet(userId) {
        let result = {};
        try {
            if (!userId) {
                result.status = 400;
                result.errors = {
                    errors: 'Id não enviado',
                    message: "Id não identificado."
                }
                return result;
            }

            const isHaveWallet = await this.walletsRepository.getWalletByUserId(userId);
            
            result.data = isHaveWallet;
            result.status = 200;

        } catch (error) {
            result.status = 500
            result.errors = {
                errors: error.message,
                message: "Erro inesperado aconteceu!" + error.message
            }
        }
        
        return result;
    }

    #getTypeInvestments(typeInvestmentsId) {
        const typeInvestmentsName = {
            [TypeInvestments.ACTION]: 'Ação',
            [TypeInvestments.FIIS]: 'Fundo Imobiliário',
            [TypeInvestments.BRD]: 'BRD',
            [TypeInvestments.CRYPTO]: 'Criptomoeda',
        }
        return typeInvestmentsName[typeInvestmentsId] || '';
    }
}

module.exports = InvestmentsMaintenance;