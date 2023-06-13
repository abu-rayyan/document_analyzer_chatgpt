# Document Analyzer ChatGPT

This repository contains code for a Python project that utilizes ChatGPT to analyze documents. It allows you to upload a document of approximately 3-4 pages and ask relevant questions about its content. The project uses sockets for sending and receiving messages.

## Installation

1. Clone this repository to your local machine using the following command:

    ```
    git clone https://github.com/your-username/document_analyzer_chatgpt.git
    ```

2. Install all the required dependencies by running the following command:

    ```
    pip install -r requirements.txt
    ```

## Usage

1. Ensure that you have your own OpenAI API key. If you don't have one, you can obtain it from the OpenAI website.

2. Create a `.env` file in the base folder of the project and write your OpenAI key there using the following format:

    ```
    OPEN_AI_KEY_ID=your-openai-key
    ```

3. Run the project by executing the main script:

    ```
    python main.py
    ```

4. Once the project is running, you can upload a document (approximately 3-4 pages in length) and then ask relevant questions about its content.

## Additional Features

- The notebook included in this repository contains code to calculate the total number of tokens for each request. This can help you manage your usage of the OpenAI API effectively.

- The project includes optimized prompts that restrict the chatbot to answering questions related to the uploaded document. This ensures more accurate and relevant responses.

## Contributing

If you would like to contribute to this project, please follow these steps:

1. Fork the repository on GitHub.

2. Create a new branch with a descriptive name for your feature or bug fix.

3. Commit your changes to the new branch.

4. Push your changes to your forked repository.

5. Submit a pull request explaining your changes and why they should be merged.

Please ensure that you adhere to the code style and conventions used in the existing codebase.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code according to your needs.

## Acknowledgements

- This project utilizes the OpenAI GPT-3.5 language model. Visit the [OpenAI website](https://openai.com) for more information.

- The code in this repository was inspired by various document analysis and natural language processing projects.
