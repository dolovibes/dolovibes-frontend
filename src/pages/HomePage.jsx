import React, { useState } from 'react';
import VideoHero from '../components/VideoHero';
import PackageRecommendations from '../components/PackageRecommendations';
import Footer from '../components/Footer';

const HomePage = () => {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [packages, setPackages] = useState([]);

    const handleExperienceSelect = (experience, pkgs) => {
        setSelectedExperience(experience);
        setPackages(pkgs || []);
    };

    return (
        <div className="min-h-screen">
            <VideoHero onExperienceSelect={handleExperienceSelect} />

            {/* Package Recommendations - only shows when experience is selected */}
            {selectedExperience && packages.length > 0 && (
                <>
                    <PackageRecommendations
                        packages={packages}
                        experienceTitle={selectedExperience.title}
                    />
                    <Footer />
                </>
            )}
        </div>
    );
};

export default HomePage;
