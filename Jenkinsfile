pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'devops-platform'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Checked out commit: $(git rev-parse HEAD)"'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest"
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                script {
                    sh '''
                        CONTAINER_ID=$(docker run -d --name test-container-${BUILD_NUMBER} ${DOCKER_IMAGE}:${DOCKER_TAG})
                        sleep 5
                        CONTAINER_IP=$(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' test-container-${BUILD_NUMBER})
                        curl --fail http://${CONTAINER_IP}:3000/health
                        docker stop test-container-${BUILD_NUMBER}
                        docker rm test-container-${BUILD_NUMBER}
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker stop test-container-${BUILD_NUMBER} || true'
            sh 'docker rm test-container-${BUILD_NUMBER} || true'
            sh 'docker system prune -f || true'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs above.'
        }
    }
}
