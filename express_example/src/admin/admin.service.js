const User = require('../users/user.entity');
const { Forbidden } = require('http-errors')
const {usr_roles} = require('../commons/util')

class AdminService{
   async unlock(user,id){
      
       if(user.role.toString() != usr_roles.admin){
           throw new Forbidden('Not authorized!');
       }
       const user1 = await User.findById(id).exec();
       
       user1.state = false;
       user1.fail_counter = 0;
      
       return  user1.save();
        
   }

   async lock(user, id){
       
        if(user.role.toString() != usr_roles.admin){
            throw new Forbidden('Not authorized!');
        }
        const user1 = await User.findById(id).exec();
        user1.state = true;
        return  user1.save();
         
        
}
}
module.exports = new AdminService();