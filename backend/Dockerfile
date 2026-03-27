FROM public.ecr.aws/lambda/python:3.11

# Copy requirements and install dependencies
COPY requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install -r requirements.txt

# Copy function code
COPY lambda_handler.py ${LAMBDA_TASK_ROOT}
COPY app.py ${LAMBDA_TASK_ROOT}

# Copy the ridethebus directory
COPY ../ridethebus-react/ridethebus ${LAMBDA_TASK_ROOT}/ridethebus-react/ridethebus

# Set the CMD to the Lambda handler
CMD ["lambda_handler.handler"]