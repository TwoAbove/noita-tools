import React from 'react';

const uri =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAICAIAAABGc1mbAAAABnRSTlMAAAAAAABupgeRAAAANklEQVR4nGNgoCvQKd9Asur///9BuIxoBry/tEdQzwVCMjAw1Ga7Q8TD5TgJm2qy6w1V3YoGABTFEyRlTe82AAAAAElFTkSuQmCC';

const WandIcon = () => {
	return (
		<img
			alt="Light_Bullet"
			src={uri}
			style={{ width: '3rem', imageRendering: 'crisp-edges' }}
		></img>
	);
};

export default WandIcon;