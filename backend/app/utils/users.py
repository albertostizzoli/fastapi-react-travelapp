from passlib.context import CryptContext  # per hash password
import re # per lavorare con le espressioni regolari

# configurazione per hashing password
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# funzione per hashare la password nel database
def get_password_hash(password: str):
    return pwd_context.hash(password)

# per verificare se la password è corretta quando si fa il login
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# funzione per validare la password secondo certi requisiti
def validate_password(password: str) -> dict:
    """
    Valida una password secondo le seguenti regole:
    - almeno 8 caratteri
    - almeno una lettera maiuscola
    - almeno una lettera minuscola
    - almeno un numero
    - almeno un carattere speciale
    """

    min_length = 8
    special_chars = r"!@#$%^&*(),.?\":{}|<>"

    # Controlli con regex
    has_upper = bool(re.search(r"[A-Z]", password))
    has_lower = bool(re.search(r"[a-z]", password))
    has_number = bool(re.search(r"[0-9]", password))
    has_special = bool(re.search(f"[{re.escape(special_chars)}]", password))

    is_valid = (
        len(password) >= min_length
        and has_upper
        and has_lower
        and has_number
        and has_special
    )

    return {
        "is_valid": is_valid,
        "errors": {
            "length": len(password) >= min_length,
            "upper": has_upper,
            "lower": has_lower,
            "number": has_number,
            "special": has_special,
        },
    }
