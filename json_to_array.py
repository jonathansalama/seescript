import json

with open('./pillbox_names.json') as f:
  data = json.load(f)

names_array = set()
for entry in data:
  thename = entry["medicine_name"].lower()
  names_array.add(str(thename))

print(len(names_array))

f = open("long_drugs2.json", "w")
f.write(json.dumps(sorted(names_array), sort_keys=True, indent=4))
f.close()