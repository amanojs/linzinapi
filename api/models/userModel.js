module.exports = class userModel {
    constructor() {
        this.email = ""
        this.pass = ""
        this.idcard = ""
        this.date = ""
    }
    set email(email) {
        this._email = email
    }
    set pass(pass) {
        this._pass = pass
    }
    set idcard(card_url) {
        this.idcard = card_url
    }
    set date(date) {
        this.date = date
    }
} 