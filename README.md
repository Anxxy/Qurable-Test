# Qurable-Test

## Requirements

- Node JS
- Yarn
- Redis

## Steps to run the program

1. Execute the `yarn install` command.
2. Copy the contents of `.env.example` to a `.env` file and fill in all the fields.
3. To run the server in development environment run the `yarn dev` command, otherwise run the `yarn build` command and then run `yarn start`.

## Deployed server link

- `https://qurable-test.herokuapp.com/`

## Server details

### Paths-UseCases

- **POST:** /topsecret

  - Entrada

    ```json
    {
    	"satellites": [
    		{
    			"name": "Kenobi",
    			"distance": 500,
    			"message": ["Hello", "", "", "is", "Andre"]
    		},
    		{
    			"name": "Skywalker",
    			"distance": 424.26,
    			"message": ["", "my", "", "", ""]
    		},
    		{
    			"name": "Sato",
    			"distance": 707.11,
    			"message": ["Hello", "", "name", "", ""]
    		}
    	]
    }
    ```

  - Salida

    ```json
    {
    	"position": {
    		"x": -200,
    		"y": 200
    	},
    	"message": "Hello my name is Andre"
    }
    ```

- **POST:** /topsecret_split/{name}
  - Entrada

    ```json
    {
    	"distance": 500,
    	"message": ["Hello", "", "", "is", "Andre"]
    }
    ```
  
- **GET:** /topsecret_split
  
  - Salida
  
    ```json
    {
    	"position": {
    		"x": -200,
    		"y": 200
    	},
    	"message": "Hello my name is Andre"
    }
    ```