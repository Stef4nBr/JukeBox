
 const urlSchema = {
    title: 'characters',
    version: 0,
    type: 'object',
    primaryKey: 'id',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        name: {
            type: 'string',
            maxLength: 100
        }, 
        user: {
            type: 'string',
            maxLength: 100
        },
        uuid: {
            type: 'string',
            maxLength: 100
        },
        created: {
            type: 'date-time',
        },
        urls: {
            "type": "array",
            "maxItems": 100,
            "uniqueItems": false,
            "items": {
                "type": "array",
                "properties": {
                    "url": {
                        "type": "string",
                        maxLength: 100
                    },
                    "description": {
                        "type": "string",
                        maxLength: 100
                    },
                    "messege": {
                        "type": "string",
                        maxLength: 150
                    },
                    "added": {
                        "type": 'date-time'
                    },
                    "addedBy": {
                        "type": 'string'
                    },
                    "lastPlayed": {
                        "type": 'date-time'
                    }
                }
            }
        }
    },
    required: ['id'],
  }
  
  module.exports = {
    urlSchema,
  }