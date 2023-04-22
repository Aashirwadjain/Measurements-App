from flask import Flask, request, jsonify
import csv

app = Flask(__name__)


@app.route('/api/add_measurement', methods=['POST'])
def add_measurement():
    data = request.get_json()
    height = float(data.get('height'))
    age = float(data.get('age'))
    weight = float(data.get('weight'))
    waist = float(data.get('waist'))
    with open('measurements.csv', mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([height, age, weight, waist])
    return jsonify({'message': 'Measurement added successfully!'}), 201


@app.route('/api/get_measurements', methods=['GET'])
def get_measurements():
    height = request.args.get('height')
    age = request.args.get('age')
    weight = request.args.get('weight')
    filtered_measurements = set()
    with open('measurements.csv', mode='r') as file:
        reader = csv.reader(file)
        for row in reader:
            if int(float(row[0])) == int(float(height)) and int(float(row[1])) == int(float(age)) and int(float(row[2])) == int(float(weight)):
                filtered_measurements.add(float(row[3]))
    print(filtered_measurements)
    return jsonify({'waist_measurements': list(filtered_measurements)}), 200


if __name__ == '__main__':
    app.run(debug=True)
