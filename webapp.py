from flask import Flask, render_template, jsonify, json

from flask_sqlalchemy  import SQLAlchemy
from sqlalchemy import func, desc, Date, String
from sqlalchemy.orm import aliased
from sqlalchemy.sql.expression import case, literal, union



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

@app.route('/initialdload')
def initialload():



    query_bar = db.session.query(func.cast(Fact.lunch_date, String).label('lunch_date'), Fact.food_type, Fact.baseline, 
    Fact.actual, Fact.breakfast)

    query_pie1 = db.session.query(Fact.food_type.distinct().label('food_type'), 
    func.sum(Fact.actual).label('sum')).group_by(Fact.food_type)

    # query for pie no.2
    case1 = case([(Fact.actual > Fact.baseline, 1),],
        else_ = 0).label("over_baseline")

    case2 = case([(Fact.actual <= Fact.baseline, 1),],
        else_ = 0).label("within_baseline")

    subq1 = db.session.query(Fact.food_type, case1, case2).subquery()
    

    query_pie2a = db.session.query(literal('over').label('baseline'), 
     func.sum(subq1.c.over_baseline).label('val'))
    
    query_pie2b = db.session.query(literal('within').label('baseline'), 
     func.sum(subq1.c.within_baseline).label('val'))

    query_pie2 = query_pie2a.union(query_pie2b)

    #query for heatmap   
    query_heatbox = db.session.query(func.to_char(Fact.lunch_date, 'Day').distinct().label('Weekday'), 
     func.sum(Fact.actual).label('sum')).group_by('Weekday')

    #query for the linechart
    base_fct = aliased(Fact)
    actual_fct = aliased(Fact)
  
    query_line = db.session.query(Fact.lunch_date, db.session.query(func.sum(base_fct.baseline)).filter(base_fct.lunch_date <= Fact.lunch_date).label('inc_base'), 
     db.session.query(func.sum(actual_fct.actual)).filter(actual_fct.lunch_date <= Fact.lunch_date).label('inc_actual'))
  
  #create the list for json response
    json_resp = [[], [], [], [], []]

    for item in query_bar:
        temp_dict = dict(lunch_d=str(item.lunch_date), food_type=item.food_type, baseline=item.baseline, 
        actual=item.actual, breakfast=item.breakfast)

        json_resp[0].append(temp_dict)

    for item in query_pie1:
        temp_dict = dict(food_type=item.food_type, vsum=item.sum)
        json_resp[1].append(temp_dict)

    for item in query_line:
        temp_dict = dict(lunch_d=str(item.lunch_date), inc_base=item.inc_base, inc_actual=item.inc_actual, inc_savings=item.inc_base - item.inc_actual)

        json_resp[2].append(temp_dict)
    
    for item in query_heatbox:
        temp_dict = dict(weekday=item.Weekday.strip(), vsum=item.sum)
        json_resp[3].append(temp_dict)

    for item in query_pie2:
        temp_dict = dict(baseline=item.baseline, val=item.val)
        print(temp_dict)
        json_resp[4].append(temp_dict)


    return jsonify(json_resp)

@app.route('/piechangefreq')
def pie_change_freq():
    query_pie1 = db.session.query(Fact.food_type.distinct().label('food_type'), 
     func.count(Fact.food_type).label('freq')).group_by(Fact.food_type)

    json_resp = []
    for item in query_pie1:
        temp_dict = dict(food_type=item.food_type, vsum=item.freq)
        json_resp.append(temp_dict)

    return jsonify(json_resp)

@app.route('/piechangeval')
def pie_change_val():

    query_pie1 = db.session.query(Fact.food_type.distinct().label('food_type'), 
     func.sum(Fact.actual).label('sum')).group_by(Fact.food_type)

    json_resp = []
    for item in query_pie1:
        temp_dict = dict(food_type=item.food_type, vsum=item.sum)
        json_resp.append(temp_dict)

    return jsonify(json_resp)

@app.route('/barchangeinc')
def bar_change_inc():

    base_fct = aliased(Fact)
    actual_fct = aliased(Fact)

    query_bar = db.session.query(Fact.lunch_date, Fact.food_type, db.session.query(func.sum(base_fct.baseline)).filter(base_fct.lunch_date <= Fact.lunch_date).label('inc_base'), 
     db.session.query(func.sum(actual_fct.actual)).filter(actual_fct.lunch_date <= Fact.lunch_date).label('inc_actual'))
     
    json_resp = []

    for item in query_bar:
        temp_dict = dict(lunch_d=str(item.lunch_date), food_type=item.food_type, baseline=item.inc_base, 
        actual=item.inc_actual)
        json_resp.append(temp_dict)



    return jsonify(json_resp)

@app.route('/barchangedisc')
def bar_change_disc():

    query_bar = db.session.query(func.cast(Fact.lunch_date, String).label('lunch_date'), Fact.food_type, Fact.baseline, 
    Fact.actual, Fact.breakfast)

    json_resp = []

    for item in query_bar:
        temp_dict = dict(lunch_d=str(item.lunch_date), food_type=item.food_type, baseline=item.baseline, 
        actual=item.actual, breakfast=item.breakfast)
        json_resp.append(temp_dict)

    return jsonify(json_resp)

@app.route('/heatchangeavg')
def heat_change_avg():
    query_heatbox = db.session.query(func.to_char(Fact.lunch_date, 'Day').distinct().label('Weekday'), 
     func.avg(Fact.actual).label('avg')).group_by('Weekday')

    json_resp = []

    for item in query_heatbox:
        temp_dict = dict(weekday=item.Weekday.strip(), vsum=item.avg)
        json_resp.append(temp_dict)

    return jsonify(json_resp)


@app.route('/heatchangetot')
def heat_change_tot():

    query_heatbox = db.session.query(func.to_char(Fact.lunch_date, 'Day').distinct().label('Weekday'), 
     func.sum(Fact.actual).label('sum')).group_by('Weekday')

    json_resp = []

    for item in query_heatbox:
        temp_dict = dict(weekday=item.Weekday.strip(), vsum=item.sum)
        json_resp.append(temp_dict)

    return jsonify(json_resp)


@app.route('/basepercent')
def base_percent():
    case1 = case([(Fact.actual > Fact.baseline, 1),],
        else_ = 0).label("over_baseline")

    case2 = case([(Fact.actual <= Fact.baseline, 1),],
        else_ = 0).label("within_baseline")

    subq1 = db.session.query(Fact.food_type, case1, case2).subquery()
    

    query_pie2a = db.session.query(literal('over').label('baseline'), 
     func.sum(subq1.c.over_baseline).label('val'))
    
    query_pie2b = db.session.query(literal('within').label('baseline'), 
     func.sum(subq1.c.within_baseline).label('val'))

    query_pie2 = query_pie2a.union(query_pie2b)

    json_resp = []

    for item in query_pie2:
        temp_dict = dict(baseline=item.baseline, val=item.val)
        print(temp_dict)
        json_resp.append(temp_dict)


    return jsonify(json_resp)

@app.route('/basepercent/<ftype>')
def base_percent_ftype(ftype):

    case1 = case([(Fact.actual > Fact.baseline, 1),],
        else_ = 0).label("over_baseline")

    case2 = case([(Fact.actual <= Fact.baseline, 1),],
        else_ = 0).label("within_baseline")

    subq1 = db.session.query(Fact.food_type, case1, case2).subquery()
    

    query_pie2a = db.session.query(literal('over').label('baseline'), 
     func.sum(subq1.c.over_baseline).label('val')).group_by('food_type').filter(subq1.c.food_type == ftype)
    
    query_pie2b = db.session.query(literal('within').label('baseline'), 
     func.sum(subq1.c.within_baseline).label('val')).group_by('food_type').filter(subq1.c.food_type == ftype)

    query_pie2 = query_pie2a.union(query_pie2b)


    json_resp = []

    for item in query_pie2:
        temp_dict = dict(baseline=item.baseline, val=item.val)
        print(temp_dict)
        json_resp.append(temp_dict)

    return jsonify(json_resp)


if __name__ == '__main__':
    app.debug = True
    print("running")
    app.run()

