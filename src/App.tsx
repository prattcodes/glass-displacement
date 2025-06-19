import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import DockComponent from './components/DockComponent';
import PillComponent from './components/PillComponent';
import BubbleComponent from './components/BubbleComponent';
import FreeComponent from './components/FreeComponent';
import ControlPanel from './components/ControlPanel';
import DisplacementFilter from './components/DisplacementFilter';
import './styles/app.css';

gsap.registerPlugin(Draggable);

const DisplacementEffect = () => {
    const [config, setConfig] = useState({
        icons: true,
        scale: -180,
        radius: 16,
        border: 0.07,
        lightness: 50,
        displace: 0.2,
        blend: 'difference',
        x: 'R',
        y: 'B',
        alpha: 0.93,
        blur: 11,
        r: 0,
        g: 10,
        b: 20,
        width: 336,
        height: 96,
        frost: 0.05,
        theme: 'system',
        debug: false,
        top: false,
        preset: 'dock',
    });

    const effectRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);

    const presets = {
        dock: { width: 336, height: 96, displace: 0.2, icons: true, frost: 0.05, radius: 16, border: 0.07, lightness: 50, blend: 'difference', x: 'R', y: 'B', alpha: 0.93, blur: 11, r: 0, g: 10, b: 20, scale: -180 },
        pill: { width: 200, height: 80, displace: 0, frost: 0, radius: 40, icons: false, border: 0.07, lightness: 50, blend: 'difference', x: 'R', y: 'B', alpha: 0.93, blur: 11, r: 0, g: 10, b: 20, scale: -180 },
        bubble: { radius: 70, width: 140, height: 140, displace: 0, frost: 0, icons: false, border: 0.07, lightness: 50, blend: 'difference', x: 'R', y: 'B', alpha: 0.93, blur: 11, r: 0, g: 10, b: 20, scale: -180 },
        free: { width: 140, height: 280, radius: 80, border: 0.15, alpha: 0.74, lightness: 60, blur: 10, displace: 0, scale: -300, icons: false, frost: 0.05, blend: 'difference', x: 'R', y: 'B', r: 0, g: 10, b: 20 },
    };

    const renderComponent = () => {
        switch (config.preset) {
            case 'dock':
                return <DockComponent config={config} />;
            case 'pill':
                return <PillComponent config={config} />;
            case 'bubble':
                return <BubbleComponent config={config} />;
            case 'free':
                return <FreeComponent config={config} />;
            default:
                return <DockComponent config={config} />;
        }
    };

    useEffect(() => {
        const buildDisplacementImage = () => {
            const border = Math.min(config.width, config.height) * (config.border * 0.5);
            const svgMarkup = `<svg class="displacement-image" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="red"/></linearGradient><linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#0000"/><stop offset="100%" stop-color="blue"/></linearGradient></defs><rect x="0" y="0" width="${config.width}" height="${config.height}" fill="black"></rect><rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#red)" /><rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#blue)" style="mix-blend-mode: ${config.blend}" /><rect x="${border}" y="${border}" width="${config.width - border * 2}" height="${config.height - border * 2}" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${config.alpha})" style="filter:blur(${config.blur}px)" /></svg>`;
            const dataUri = `data:image/svg+xml,${encodeURIComponent(svgMarkup)}`;
            gsap.set('.filter feImage', { attr: { href: dataUri } });
        };

        const update = () => {
            buildDisplacementImage();
            gsap.set(document.documentElement, { '--width': `${config.width}px`, '--height': `${config.height}px`, '--radius': `${config.radius}px`, '--frost': config.frost });
            gsap.set('.filter feDisplacementMap', { attr: { scale: config.scale, xChannelSelector: config.x, yChannelSelector: config.y } });
            gsap.set('#redchannel', { attr: { scale: config.scale + config.r } });
            gsap.set('#greenchannel', { attr: { scale: config.scale + config.g } });
            gsap.set('#bluechannel', { attr: { scale: config.scale + config.b } });
            gsap.set('.filter feGaussianBlur', { attr: { stdDeviation: config.displace } });
        };

        update();

        document.documentElement.dataset.icons = config.icons.toString();
        document.documentElement.dataset.mode = config.preset;
        document.documentElement.dataset.top = config.top.toString();
        document.documentElement.dataset.debug = config.debug.toString();
        document.documentElement.dataset.theme = config.theme;

        if (isInitialMount.current && placeholderRef.current) {
            const { top, left } = placeholderRef.current.getBoundingClientRect();
            gsap.set(effectRef.current, { top, left, opacity: 1 });
            Draggable.create(effectRef.current, { type: 'x,y' });
            isInitialMount.current = false;
        }

    }, [config]);

    return (
        <>
            <ControlPanel config={config} setConfig={setConfig} presets={presets} />

            <header>
                <h1>Glass<br />Displacement</h1>
                <p>Advanced glass displacement effects with SVG filters.<br />Drag the glass panel and experiment with the controls.</p>
            </header>

            <div ref={effectRef} className="effect">
                {renderComponent()}
                <DisplacementFilter />
                <div className="displacement-debug">
                    <div className="label"><span>displacement image</span></div>
                </div>
            </div>

            <main>
                <section className="placeholder">
                    <div ref={placeholderRef} className="dock-placeholder"></div>
                    <section>
                        <span className="arrow arrow--debug">
                            <span>drag, scroll, configure</span>
                            <svg viewBox="0 0 122 97" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M116.102 0.0996005C114.952 0.334095 112.7 1.53002 111.433 2.53834C110.869 2.98388 109.368 4.15635 108.077 5.11778C103.455 8.6352 102.61 9.40903 102.187 10.4877C101.39 12.5982 102.798 14.5914 105.097 14.5914C106.13 14.5914 108.241 13.7941 109.696 12.8561C110.424 12.3871 111.01 12.0823 111.01 12.1526C111.01 12.692 107.796 17.8274 106.2 19.8206C102.023 25.0733 95.6642 29.6928 86.2548 34.2889C81.0926 36.8214 77.4555 38.2753 73.9123 39.2367C71.7066 39.823 70.6507 39.9871 67.9053 40.0809C66.0516 40.1513 64.5499 40.1747 64.5499 40.1278C64.5499 40.0809 64.808 38.9788 65.1365 37.6891C65.465 36.3993 65.8404 34.1716 66.0047 32.7647C66.4505 28.3796 65.4884 24.2994 63.4704 22.2359C62.1564 20.8758 60.9363 20.3599 59.0121 20.3599C57.6043 20.3599 57.1115 20.4537 55.7975 21.1103C52.8878 22.5407 50.5648 25.9878 49.5089 30.4197C48.453 34.922 49.2742 38.0877 52.3481 41.1127C53.4744 42.2148 54.46 42.9183 55.9852 43.6921C57.1584 44.2549 58.1439 44.7473 58.1909 44.7708C58.5898 45.0053 54.5304 53.4705 52.0666 57.6211C47.4674 65.3125 39.3486 74.575 30.5728 82.0789C22.2427 89.2309 16.7285 92.4435 9.87677 94.1553C8.28116 94.554 7.13138 94.6478 4.2452 94.6478C1.17131 94.6712 0.608154 94.7181 0.608154 95.023C0.608154 95.234 1.19478 95.5857 2.13337 95.9609C3.54126 96.4768 3.96363 96.5472 7.41296 96.5237C10.5572 96.5237 11.4724 96.4299 13.1149 96.0078C21.7265 93.6863 31.1594 87.1908 42.6102 75.7006C49.2977 69.0175 52.5828 64.9373 56.1494 58.9343C58.0501 55.7217 60.6312 50.6801 61.7575 47.9365L62.5553 45.9902L64.0806 46.1543C71.3547 46.9047 77.7136 45.3101 88.3667 40.034C96.2274 36.1414 101.976 32.3426 106.505 28.0748C108.617 26.0816 111.855 22.2828 112.794 20.7117C113.028 20.313 113.286 19.9847 113.357 19.9847C113.427 19.9847 113.662 20.782 113.873 21.72C114.084 22.6814 114.647 24.276 115.093 25.2609C115.82 26.8085 116.008 27.043 116.454 26.9727C116.876 26.9258 117.228 26.4333 117.956 24.9795C119.317 22.2828 119.833 20.2661 120.772 13.8879C121.757 7.25168 121.781 4.4143 120.889 2.56179C119.95 0.615488 118.12 -0.322489 116.102 0.0996005ZM60.7016 25.7767C61.4525 26.9023 61.8279 29.2942 61.6637 31.9205C61.4759 34.7813 60.5139 38.9788 60.0681 38.9788C59.5284 38.9788 57.1584 37.6422 56.2198 36.8214C54.8354 35.6021 54.3426 34.2889 54.5538 32.2957C54.8589 29.2473 56.1964 26.2223 57.5808 25.3547C58.7306 24.6512 60.0681 24.8388 60.7016 25.7767Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </span>
                    </section>
                </section>

                <section>

                    <p>How do you create backdrop displacement with HTML and CSS? SVG. The idea is that you need a displacement map that distorts the input image. In this case, the backdrop of our element (whatever is underneath).</p>
                </section>


                <section>
                    <div className="apps">
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/beeper.png" alt="Beeper" />
                            <span>Beeper</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/cursor.png" alt="Cursor" />
                            <span>Cursor</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/screenstudio.png" alt="Screen Studio" />
                            <span>Screen Studio</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/raycast.png" alt="Raycast" />
                            <span>Raycast</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/photos.png" alt="Photos" />
                            <span>Photos</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/signal.png" alt="Signal" />
                            <span>Signal</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/spotify.png" alt="Spotify" />
                            <span>Spotify</span>
                        </div>
                        <div className="app">
                            <img src="https://assets.codepen.io/605876/brave.png" alt="Brave" />
                            <span>Brave</span>
                        </div>
                    </div>
                </section>

                <section>
                    <p>Check the "debug" option to see the displacement map used and play with the options. The red and blue of the displacement map displaces the backdrop. The caveats? You need to update the map image whenever the shape of the element changes. The big one? backdrop-filter: url() currently only works in Chromium and not Gecko/Webkit.</p>
                </section>

                <section className="emojis">
                    <span>🧑‍🍳</span><span>🤓</span><span>🤪</span><span>🙄</span><span>🤠</span><span>🥸</span>
                </section>

                <section className="images">
                    <img src="https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2" alt="Random" />
                    <img src="https://images.pexels.com/photos/1684168/pexels-photo-1684168.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2" alt="Random" />
                    <img src="https://images.pexels.com/photos/67517/pexels-photo-67517.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2" alt="Random" />
                </section>

            </main>

            <footer>
                Inspired by <a href="https://codepen.io/jh3y/pen/EajLxJV" target="_blank" rel="noopener noreferrer">Jhey's Glass Displacement Effect</a>
            </footer>
        </>
    );
};

export default DisplacementEffect;