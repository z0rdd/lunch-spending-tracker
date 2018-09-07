from flask_sqlalchemy  import SQLAlchemy
from webapp import app

db = SQLAlchemy(app)

class Fact(db.Model):

    __tablename__ = "fct_table"
    date = db.Column(db.Date, primary_key=True)
    food_type = db.Column(db.String(20))
    baseline = db.Column(db.Numeric(10))
    actual = db.Column(db.Numeric(10))
    breakfast = db.Column(db.BOOLEAN)
    

    def __init__(self, date, food_type, baseline, actual, breakfast):
        self.date = date
        self.food_type = food_type
        self.baseline = baseline
        self.actual = actual
        self.breakfast = breakfast
