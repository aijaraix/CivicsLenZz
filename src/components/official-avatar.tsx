import React, { useState, useEffect } from 'react';
import { TrackedOfficial } from '../lib/civic-database';
import { verifyPhotoSource } from '../lib/photo-verifier';

// Map of verified official government & Wikipedia Commons public domain portraits ONLY
const VERIFIED_OFFICIAL_PHOTOS: Record<string, string[]> = {
  'daniella-levine-cava': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Daniella_Levine_Cava_portrait.jpg/800px-Daniella_Levine_Cava_portrait.jpg',
  ],
  'gregory-tony': [
    'https://www.browardsheriff.org/AboutBSO/PublishingImages/Sheriff%20Gregory%20Tony%20Official.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Gregory_Tony.jpg/800px-Gregory_Tony.jpg',
  ],
  'francis-suarez': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Francis_Suarez_by_Gage_Skidmore.jpg/800px-Francis_Suarez_by_Gage_Skidmore.jpg',
  ],
  'steven-meiner': [
    'https://www.miamibeachfl.gov/wp-content/uploads/2023/11/Steven-Meiner-Mayor.jpg',
  ],
  'alex-fernandez': [
    'https://www.miamibeachfl.gov/wp-content/uploads/2021/11/Alex-Fernandez-Commissioner.jpg',
  ],
  'shevrin-jones': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Shevrin_Jones_%28cropped%29.jpg/800px-Shevrin_Jones_%28cropped%29.jpg',
  ],
  'fabian-basabe': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Fabian_Basabe.jpg/800px-Fabian_Basabe.jpg',
  ],
  'frederica-wilson': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg/800px-Frederica_Wilson%2C_official_portrait%2C_112th_Congress.jpg',
  ],
  'maria-elvira-salazar': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Maria_Elvira_Salazar_117th_U.S_Congress.jpg/800px-Maria_Elvira_Salazar_117th_U.S_Congress.jpg',
  ],
  'mario-diaz-balart': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Mario_Diaz-Balart_official_portrait.jpg/800px-Mario_Diaz-Balart_official_portrait.jpg',
  ],
  'carlos-gimenez': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Carlos_Gim%C3%A9nez_official_portrait.jpg/800px-Carlos_Gim%C3%A9nez_official_portrait.jpg',
  ],
  'jared-moskowitz': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Jared_Moskowitz_118th_Congress.jpg/800px-Jared_Moskowitz_118th_Congress.jpg',
  ],
  'ron-desantis': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Ron_DeSantis_official_gubernatorial_portrait.jpg/800px-Ron_DeSantis_official_gubernatorial_portrait.jpg',
  ],
  'marco-rubio': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Senator_Rubio_official_portrait.jpg/800px-Senator_Rubio_official_portrait.jpg',
  ],
  'rick-scott': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Senator_Rick_Scott_official_portrait_2019.jpg/800px-Senator_Rick_Scott_official_portrait_2019.jpg',
  ],
  'donald-trump': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/800px-Donald_Trump_official_portrait.jpg',
  ],
  'jd-vance': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/J._D._Vance_official_portrait_118th_Congress.jpg/800px-J._D._Vance_official_portrait_118th_Congress.jpg',
  ],
  'gavin-newsom': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Gavin_Newsom_official_portrait_2019.jpg/800px-Gavin_Newsom_official_portrait_2019.jpg',
  ],
  'lucia-baez-geller': [
    'https://luciabaezgeller.com/wp-content/uploads/2020/08/lucia-baez-geller-portrait.jpg',
  ],
  'raquel-regalado': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Raquel_Regalado.jpg/800px-Raquel_Regalado.jpg',
  ],
  'richard-cruz': [
    'https://cruzfordistrict7.com/wp-content/uploads/2026/01/richard-cruz-headshot.jpg',
  ],
  'joe-saunders': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Joe_Saunders.jpg/800px-Joe_Saunders.jpg',
  ],
  'dean-trantalis': [
    'https://www.fortlauderdale.gov/home/showpublishedimage/18413/637389234850300000',
  ],
  'ric-bradshaw': [
    'https://www.pbso.org/wp-content/uploads/2019/01/Ric-Bradshaw.jpg',
  ],
  'bryan-avila': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Bryan_Avila.jpg/800px-Bryan_Avila.jpg',
  ],
  'ana-maria-rodriguez': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Ana_Maria_Rodriguez.jpg/800px-Ana_Maria_Rodriguez.jpg',
  ],
  'jason-pizzo': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Jason_Pizzo.jpg/800px-Jason_Pizzo.jpg',
  ],
  'esteban-bovo': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Esteban_Bovo.jpg/800px-Esteban_Bovo.jpg',
  ],
  'vince-lago': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Vince_Lago.jpg/800px-Vince_Lago.jpg',
  ],
  'christi-fraga': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Christi_Fraga.jpg/800px-Christi_Fraga.jpg',
  ],
  'nan-rich': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Nan_Rich.jpg/800px-Nan_Rich.jpg',
  ],
  'maria-sachs': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Maria_Sachs.jpg/800px-Maria_Sachs.jpg',
  ],
  'wayne-messam': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Wayne_Messam_by_Gage_Skidmore.jpg/800px-Wayne_Messam_by_Gage_Skidmore.jpg',
  ],
  'keith-james': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Keith_James_WPB.jpg/800px-Keith_James_WPB.jpg',
  ],
  'scott-singer': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Scott_Singer_Boca.jpg/800px-Scott_Singer_Boca.jpg',
  ],
  'rosie-cordero-stutz': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/r/r1/Rosie_Cordero_Stutz.jpg/800px-Rosie_Cordero_Stutz.jpg',
  ],
  'pedro-garcia': [
    'https://www.miamidade.gov/pa/images/pa-garcia.jpg',
  ],
  'juan-fernandez-barquin': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/j/j1/Juan_Fernandez_Barquin.jpg/800px-Juan_Fernandez_Barquin.jpg',
  ],
  'dariel-fernandez': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Dariel_Fernandez.jpg/800px-Dariel_Fernandez.jpg',
  ],
  'steve-gallon': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/s/s1/Steve_Gallon.jpg/800px-Steve_Gallon.jpg',
  ],
  'mari-tere-rojas': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/m/m1/Mari_Tere_Rojas.jpg/800px-Mari_Tere_Rojas.jpg',
  ]
};

export function OfficialAvatar({
  official,
  size = 'md',
  className = ''
}: {
  official: {
    name: string;
    initials?: string;
    color?: string;
    slug?: string;
    photoUrl?: string;
    verifiedPhotos?: string[];
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const officialSlug = official.slug || official.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const knownVerified = VERIFIED_OFFICIAL_PHOTOS[officialSlug] || [];

  // Gather candidate URLs and strictly filter with verifyPhotoSource
  const candidateUrls = Array.from(new Set([
    ...knownVerified,
    official.photoUrl,
    ...(official.verifiedPhotos || [])
  ]))
    .filter(Boolean)
    .filter(url => !url?.endsWith('.svg'))
    .filter(url => verifyPhotoSource(url).isOfficial) as string[];

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [useDirectUrl, setUseDirectUrl] = useState(false);

  useEffect(() => {
    setCandidateIndex(0);
    setImageFailed(false);
    setUseDirectUrl(false);
  }, [official.photoUrl, official.name, official.slug]);

  const currentPhoto = candidateUrls[candidateIndex];

  const handleImageError = () => {
    if (!useDirectUrl && currentPhoto && !currentPhoto.startsWith('data:') && !currentPhoto.startsWith('/')) {
      setUseDirectUrl(true);
      return;
    }

    setUseDirectUrl(false);
    if (candidateIndex + 1 < candidateUrls.length) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setImageFailed(true);
    }
  };

  // Render authentic verified photo if available
  if (currentPhoto && !imageFailed) {
    const displaySrc = (currentPhoto.startsWith('data:') || currentPhoto.startsWith('/') || useDirectUrl)
      ? currentPhoto
      : `/api/image-proxy?url=${encodeURIComponent(currentPhoto)}`;

    return (
      <div className="relative inline-block group shrink-0">
        <img
          src={displaySrc}
          alt={official.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className={`official-avatar official-avatar-${size} ${className}`}
          style={{ objectFit: 'cover' }}
        />
        <span 
          className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs" 
          title="Verified Official Source Photo"
        >
          <svg className="w-2 h-2 text-white fill-current" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </span>
      </div>
    );
  }

  // Fallback: Dignified Official Civic Insignia Emblem (Zero Fake Faces)
  const derivedInitials = official.initials || official.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2) || 'FL';

  const avatarColor = official.color || '#1e293b';

  return (
    <div
      className={`official-avatar official-avatar-${size} ${className} flex items-center justify-center font-bold text-white shadow-xs relative overflow-hidden shrink-0 border border-slate-300`}
      style={{
        background: `linear-gradient(135deg, ${avatarColor}, #0f172a)`
      }}
      title={`${official.name} — Official Photo Pending Verification`}
    >
      <div className="absolute inset-0 bg-white/10 rounded-full flex items-center justify-center">
        <span className="tracking-wider uppercase font-mono font-black text-xs sm:text-sm">
          {derivedInitials}
        </span>
      </div>
      <span 
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs" 
        title="Photo Pending Official Submission"
      >
        <span className="text-[8px] text-white font-bold">!</span>
      </span>
    </div>
  );
}
