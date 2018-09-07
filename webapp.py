from flask import Flask, render_template, jsonify, json

from flask_sqlalchemy  import SQLAlchemy
from sqlalchemy import func, desc, Date, String
from sqlalchemy.orm import aliased

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:aaa@localhost/lunch'



db = SQLAlchemy(app)

class Fact(db.Model):

    __tablename__ = "fct_table"
    lunch_date = db.Column(db.Date, primary_key=True)
    food_type = db.Column(db.String(20))
    baseline = db.Column(db.FLOAT)
    actual = db.Column(db.FLOAT)
    breakfast = db.Column(db.BOOLEAN)
    

    def __init__(self, lunch_date, food_type, baseline, actual, breakfast):
        self.lunch_date = lunch_date
        self.food_type = food_type
        self.baseline = baseline
        self.actual = actual
        self.breakfast = breakfast

@app.route('/')
def index():
    
    return render_template('index.html')

@app.route('/test')
def test():



    query_bar = db.session.query(func.cast(Fact.lunch_date, String).label('lunch_date'), Fact.food_type, Fact.baseline, 
    Fact.actual, Fact.breakfast)

    query_pie1 = db.session.query(Fact.food_type.distinct().label('food_type'), 
    func.sum(Fact.actual).label('sum')).group_by(Fact.food_type)

    mainq = aliased(Fact)
    subq1 = db.session.query(func.sum(Fact.baseline)).subquery()
    alias1 = aliased(Fact, subq1)

    query_line = db.session.query(Fact.lunch_date, alias1)
    for item in query_line:
        print(item)
    
    #inc_actual = db.session.query(func.sum(Fact.actual))

    #query_line =  db.session.query(Fact.lunch_date.label('ld'), db.session.query(func.sum(Fact.baseline)).filter(Fact.baseline <= 'ld'), inc_actual.label('inc_actual'))

    query_heatbox = db.session.query(func.to_char(Fact.lunch_date, 'Day').distinct().label('Weekday'), 
     func.sum(Fact.actual).label('sum'), 
     func.avg(Fact.actual).label('avg')).group_by('Weekday')



    json_resp = [[], [], [], []]

    
    for item in query_bar:
        temp_dict = dict(lunch_date=item.lunch_date, food_type=item.food_type, baseline=item.baseline, 
        actual=item.actual, breakfast=item.breakfast)
        json_resp[0].append(temp_dict)

    for item in query_pie1:
        temp_dict = dict(food_type=item.food_type, vsum=item.sum)
        json_resp[1].append(temp_dict)
    
    for item in query_heatbox:
        temp_dict = dict(weekday=item.Weekday.strip(), vsum=item.sum, vavg=item.avg)
        json_resp[3].append(temp_dict)       
        


    print(json.dumps(json_resp))


    
    return jsonify(json_resp)


if __name__ == '__main__':
    app.debug = True
    print("running")
    app.run()

