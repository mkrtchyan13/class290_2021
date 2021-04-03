const User = require('../users/user.entity');
const { Unauthorized, Locked } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { max_failed_attempts} = require('../commons/util');

class AuthService {
    async validate(username, password) {
        const user = await User.findOne({ username });
        if(user.fail_counter ===   max_failed_attempts){
            user.state = true;
            await user.save();
           
            throw new Locked('The user is locked!');

        }
        if (!user || !bcrypt.compareSync(password, user.password)) {
            user.fail_counter+=1;
            await user.save();
            throw new Unauthorized();
        }
        
        user.fail_couter = 0;
        user.save();
        return user;
    }

    async login(username, password) {
        const user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }
}

module.exports = new AuthService();