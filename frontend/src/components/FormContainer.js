import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const FormContainer = ({ children }) => {
	return (
		<Container className='py-4'>
			<Row className='justify-content-center'>
				<Col xs={12} md={8} lg={6}>
					<Card className='p-4 p-md-5 auth-card'>{children}</Card>
				</Col>
			</Row>
		</Container>
	);
};

export default FormContainer;
