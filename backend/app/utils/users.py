from passlib.context import CryptContext  # per hash password

# configurazione per hashing password
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# funzione per hashare la password nel database
def get_password_hash(password: str):
    return pwd_context.hash(password)

# per verificare se la password è corretta quando si fa il login
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)