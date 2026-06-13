const fs = require('fs');
const path = './src/pages/ProjectDetail.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `{displayData.galleryImages && displayData.galleryImages.length > 0 ? (
                        <div className="flex overflow-x-auto gap-8 pb-8 px-2 brutal-scrollbar">
                            {displayData.galleryImages.map((imgUrl: string, idx: number) => (
                                <div key={idx} className="relative group border-4 border-black brutal-shadow bg-white p-2 flex-none w-[80vw] md:w-[600px] h-[300px] md:h-[400px]">
                                    <img 
                                        src={imgUrl} 
                                        alt={\`Gallery \${idx + 1}\`} 
                                        className={\`w-full h-full object-cover border-2 border-black \${!isAdminModeEnbaled ? 'cursor-pointer' : ''}\`}
                                        onClick={() => !isAdminModeEnbaled && setSelectedImage(imgUrl)}
                                    />
                                    
                                    {isAdminModeEnbaled && (
                                        <button
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute -top-4 -right-4 bg-brutal-red text-white p-2 border-4 border-black hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"
                                            title="Remove Image"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (`;

const replacement = `{displayData.galleryImages && displayData.galleryImages.length > 0 ? (
                        <div className="relative w-full overflow-hidden flex pb-8 px-2 group/gallery brutal-scrollbar">
                            <div className={\`flex gap-8 w-max transition-all \${!isAdminModeEnbaled ? 'animate-[marquee_30s_linear_infinite] group-hover/gallery:[animation-play-state:paused]' : ''}\`}>
                                {(isAdminModeEnbaled ? displayData.galleryImages : [...displayData.galleryImages, ...displayData.galleryImages]).map((imgUrl: string, idx: number) => {
                                    const isDuplicate = !isAdminModeEnbaled && idx >= displayData.galleryImages.length;
                                    const originalIdx = isAdminModeEnbaled ? idx : idx % displayData.galleryImages.length;
                                    
                                    return (
                                        <div 
                                            key={idx} 
                                            className="relative group/card border-4 border-black brutal-shadow bg-white p-2 flex-none w-[80vw] md:w-[600px] h-[300px] md:h-[400px]"
                                        >
                                            <img 
                                                src={imgUrl} 
                                                alt={\`Gallery \${originalIdx + 1}\`} 
                                                className={\`w-full h-full object-cover border-2 border-black \${!isAdminModeEnbaled ? 'cursor-pointer' : ''}\`}
                                                onClick={() => !isAdminModeEnbaled && setSelectedImage(imgUrl)}
                                            />
                                            
                                            {isAdminModeEnbaled && !isDuplicate && (
                                                <button
                                                    onClick={() => handleRemoveGalleryImage(originalIdx)}
                                                    className="absolute -top-4 -right-4 bg-brutal-red text-white p-2 border-4 border-black hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"
                                                    title="Remove Image"
                                                >
                                                    <X className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (`;

if (code.includes(target)) {
    fs.writeFileSync(path, code.replace(target, replacement));
    console.log("Success");
} else {
    console.log("Target not found");
}
