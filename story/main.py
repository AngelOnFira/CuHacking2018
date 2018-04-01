import pymongo
from pymongo import MongoClient
client = MongoClient('mongodb://admin:carleton@cuhacking-shard-00-00-omz4n.mongodb.net:27017,cuhacking-shard-00-01-omz4n.mongodb.net:27017,cuhacking-shard-00-02-omz4n.mongodb.net:27017/test?ssl=true&replicaSet=cuhacking-shard-0&authSource=admin')

db = client['cuhacking']
collection = db['story']

def readFile(fileName):
    with open(fileName) as f:
        lines = f.read().splitlines()
    return lines

def insertStory(fileName):
    storyFile = readFile(fileName)
    print storyFile

    for i in range(0, len(storyFile)):
        storyText = storyFile[i].split("|")[0]
        storyOptions = storyFile[i].split("|")[1].split(",")
        storyDict = {}

        for option in storyOptions:
            storyDict[option.split("'")[0]] = option.split("'")[1]
        storyDocument = {
            "index": str(i),
            "storyText": storyText,
            "ans": storyDict
        }
        collection.insert(storyDocument)

if __name__ == "__main__":
    insertStory("story.txt")