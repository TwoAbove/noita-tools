import React from 'react';
const Donate = () => {
	return (
		<form
			action="https://www.paypal.com/cgi-bin/webscr"
			method="post"
			target="_blank"
			rel="noreferrer"
		>
			<input type="hidden" name="cmd" value="_donations" />
			<input type="hidden" name="business" value="Y9VJB7NEAVEX2" />
			<input type="hidden" name="currency_code" value="USD" />
			<input
				type="image"
				src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
				name="submit"
				title="PayPal"
				alt="Donate with PayPal button"
			/>
		</form>
	);
};

export default Donate;
