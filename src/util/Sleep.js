import PropTypes from 'prop-types';

function Sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Sleep.propTypes = {
  ms: PropTypes.number.isRequired,
};

export default Sleep;
