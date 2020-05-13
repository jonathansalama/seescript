import json

with open('./short_drugs.json') as f:
  data = json.load(f)

names_array = set()
for entry in data:
  thename = entry.split()[0].lower()
  names_array.add(str(thename))

print(len(names_array))

f = open("short_drugs2.json", "w")
f.write(json.dumps(sorted(names_array), sort_keys=True, indent=4))
f.close()