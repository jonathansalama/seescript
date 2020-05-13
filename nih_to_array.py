import json

names_array = []
lower_array = set()

with open('./nih_drugs.txt') as f:
    names_array = f.read().splitlines()

for line in names_array:
    lowerline = line.split()[0].lower()
    lower_array.add(lowerline)

print(len(lower_array))

f = open("nih_drugs_first.json", "w")
f.write(json.dumps(sorted(lower_array), sort_keys=True, indent=4))
f.close()