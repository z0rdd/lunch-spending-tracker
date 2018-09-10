import pandas as pd


def add_inc_sum(df, column_no):

    temp_list = []
    for row in df.iterrows():
        if len(temp_list) == 0:
            temp_list.append(float(row[1][column_no]))
        else:
            temp_list.append(float(row[1][column_no]) + float(temp_list[-1]))
    return temp_list

def parse_query(query_obj):
    df = pd.DataFrame()
    ldate, baseline, actual = [], [], []

    for item in query_obj:
        ldate.append(item.lunch_date)
        baseline.append(item.baseline)
        actual.append(item.actual)
    df['lunch_date'] = ldate
    df['baseline'] = baseline
    df['actual'] = actual
    return df 

def get_incremental_sum(query_obj):


    df = parse_query(query_obj)

    df['inc_base'] = add_inc_sum(df, 1)
    df['inc_act'] = add_inc_sum(df, 2)
    df['inc_savings'] = df['inc_base'] - df['inc_act']
    return_list = []

    for item in df.iterrows():
        temp_dict = dict()
        temp_dict['lunch_date'] = str(item[1].lunch_date)
        temp_dict['inc_base'] = item[1].inc_act
        temp_dict['inc_savings'] = item[1].inc_savings

        return_list.append(temp_dict)

    return return_list