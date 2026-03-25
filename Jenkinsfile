pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = '968134752349' 
        AWS_REGION     = 'ap-south-2'
        
        // ECR Repository Names
        FRONT_REPO = 'mern-app-frontend' 
        BACK_REPO  = 'mern-app-backend'
        
        // Target EC2 Details
        EC2_IP     = '16.112.7.234'
        
        // JENKINS CREDENTIALS ID (Indha ID Jenkins-la irukura ID-kuda match aaganum)
        SSH_CREDENTIALS_ID = 'My-aws-Key' 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sureshbharathi26/Docker-project.git'
            }
        }

        stage('ECR Login') {
            steps {
                // Jenkins machine-la ECR login
                sh "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
            }
        }

        stage('Build & Push to ECR') {
            steps {
                script {
                    // Frontend Process
                    dir('frontend') {
                        sh "docker build -t ${FRONT_REPO} ."
                        sh "docker tag ${FRONT_REPO}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONT_REPO}:latest"
                        sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONT_REPO}:latest"
                    }
                    // Backend Process (GitHub repo-la 'Backend' nu Capital-la irundha 'B' use pannunga)
                    dir('Backend') {
                        sh "docker build -t ${BACK_REPO} ."
                        sh "docker tag ${BACK_REPO}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACK_REPO}:latest"
                        sh "docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACK_REPO}:latest"
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                // SSH Agent use panni EC2 kulla connect panrom
                sshagent(["${env.SSH_CREDENTIALS_ID}"]) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} << 'EOF'
                        # 1. EC2 kulla ECR Login
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                        
                        # 2. Stop old containers (if any)
                        docker stop frontend backend || true
                        docker rm frontend backend || true
                        
                        # 3. Pull latest images
                        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONT_REPO}:latest
                        docker pull ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACK_REPO}:latest
                        
                        # 4. Run new containers
                        docker run -d --name frontend -p 80:80 ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${FRONT_REPO}:latest
                        docker run -d --name backend -p 5000:5000 ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${BACK_REPO}:latest
                        
                        echo "Deployment Successful on EC2!"
EOF
                    """
                }
            }
        }
    }
}