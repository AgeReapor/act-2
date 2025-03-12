import { Text, View } from 'react-native';

import { EditScreenInfo } from './EditScreenInfo';
import { BoardItem } from './BoardItem';
import { BoardItemType } from 'types/BoardItemType';
import { Vector2 } from 'types/Vector2';
import { Move } from 'types/Move';

type ScreenContentProps = {
    title: string;
    path: string;
    children?: React.ReactNode;
};

export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
    return (
        <View className={styles.container}>
            <Text className={'text-xl font-bold text-green-600'}>{title}</Text>
            <View className={styles.separator} />
            <EditScreenInfo path={path} />
            <BoardItem
                key="a"
                type={BoardItemType.PEG}
                position={{ x: 0, y: 0 }}
                colors={['bg-teal-200', 'bg-teal-400']}
                playableMoves={[]}
                moveHandler={(m: Move) => ({})}></BoardItem>
            <BoardItem
                key="b"
                type={BoardItemType.HOLE}
                position={{ x: 1, y: 0 }}
                colors={['bg-teal-200', 'bg-teal-400']}
                playableMoves={[]}
                moveHandler={(m: Move) => ({})}></BoardItem>
            {children}
        </View>
    );
};
const styles = {
    container: `items-center flex-1 justify-center p`,
    separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
};
