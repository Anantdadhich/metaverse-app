import { error } from 'node:console';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';


const keylength=32;
/**
 * Has a password or a secret with a password hashing algorithm (scrypt)
 * @param {string} password
 * @returns {string} The salt+hash
 */


export const hash=async (password:string):Promise<string> =>{
  return new Promise((resolve,reject)=>{
       const salt=randomBytes(16).toString("hex")

       scrypt(password,salt,keylength,(error,derivedkey)=>{
           if(error) reject(error);

           resolve(`${salt}.${derivedkey.toString("hex")}`) 
       })
  })

};


/**
 * Compare a plain text password with a salt+hash password
 * @param {string} password The plain text password
 * @param {string} hash The hash+salt to check against
 * @returns {boolean}
 */
export const compare=async(password:string,hash:string) :Promise<boolean> =>{
    return  new Promise((resolve,reject)=>{
          const [salt,hashkey]=hash.split(".");

          const hashkeybuff=Buffer.from(hashkey,"hex");

          scrypt(password,salt,keylength,(error,derivedkey)=>{
              if (error) reject (error)
                resolve(timingSafeEqual(hashkeybuff,derivedkey))
          })
    })
};
