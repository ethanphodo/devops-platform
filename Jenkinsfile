pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'devops-platform'
        DOCKER_TAG = "${BUILD_NUMBER}"
        // Add your Docker Hub username when ready to push
        // DOCKER_HUB_USER = 'ethanphodo'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh 'echo "Checked out commit: $(git rev-parse HEAD)"'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                dir('app') {
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint') {
            steps {
                dir('app') {
                    sh 'npm run lint'
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('app') {
                    sh 'npm test'
                }
            }
            post {
                always {
                    // Archive test results if using junit reporter
                    junit allowEmptyResults: true, testResults: 'app/coverage/junit.xml'
                }
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
                    // Run container and test health endpoint
                    sh '''
                        docker run -d -p 3000:3000 --name test-container ${DOCKER_IMAGE}:${DOCKER_TAG}
                        sleep 5
                        curl --fail http://localhost:3000/health
                        docker stop test-container
                        docker rm test-container
                    '''
                }
            }
        }
        
        // Uncomment when ready to push to Docker Hub
        // stage('Push to Registry') {
        //     when {
        //         branch 'main'
        //     }
        //     steps {
        //         script {
        //             withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //                 sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        //                 sh "docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_USER}/${DOCKER_IMAGE}:${DOCKER_TAG}"
        //                 sh "docker push ${DOCKER_USER}/${DOCKER_IMAGE}:${DOCKER_TAG}"
        //             }
        //         }
        //     }
        // }
        
        // Uncomment when ready to deploy
        // stage('Deploy') {
        //     when {
        //         branch 'main'
        //     }
        //     steps {
        //         sh './scripts/deploy.sh'
        //     }
        // }
    }
    
    post {
        always {
            // Clean up Docker images to save space
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
