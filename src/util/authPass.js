import crypto from 'crypto'

const algorithm = 'aes-256-cbc';  // AES encryption algorithm
const secretKey = 'iamrohan'
const key = crypto.createHash('sha256').update(secretKey).digest();// Must be 32 characters for AES-256
const iv = crypto.randomBytes(16); // Random Initialization Vector (IV)


export function encryptPassword(password) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    // Return both the encrypted password and the IV (needed for decryption)
    return `${iv.toString('hex')}:${encrypted}`;
  }
  
  
  // Function to decrypt an encrypted password
  export function decryptPassword(encryptedData) {
    const [ivHex, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
  } 