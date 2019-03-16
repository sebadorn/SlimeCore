'use strict';


/**
 * @namespace SlimeCore.Shader
 */
SlimeCore.Shader = {


	/**
	 * Read the shader files.
	 * @param  {string} baseName - Name of the shader files without path and extension.
	 * @return {object} Contents of the vertex and fragment shader.
	 */
	readShaderFiles( baseName ) {
		const fs = require( 'fs' );
		let shaderDir = 'js/SlimeCore/shaders/';

		let vertFile = shaderDir + baseName + '.vert';
		let vertexShader = fs.readFileSync( vertFile, 'utf8' );

		let fragFile = shaderDir + baseName + '.frag';
		let fragmentShader = fs.readFileSync( fragFile, 'utf8' );

		return {
			vertex: vertexShader,
			fragment: fragmentShader
		};
	}


};
