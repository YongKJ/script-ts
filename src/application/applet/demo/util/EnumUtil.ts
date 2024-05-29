import {StatisticsPerspective} from "../pojo/enum/StatisticsPerspective";
import {StatisticsPosition} from "../pojo/enum/StatisticsPosition";
import {VideoStatus} from "../pojo/enum/VideoStatus";
import {VideoType} from "../pojo/enum/VideoType";

export class EnumUtil {

    public static getValueTypeField(type: string): string {
        switch (type) {
            case "平均值":
                return "avgValue";
            case "最大值":
                return "maxValue";
            case "最小值":
                return "minValue";
            case "实际值":
                return "realValue";
            default:
                return "value";
        }
    }

    public static getVideoTypeName(type: VideoType): string {
        switch (type) {
            case VideoType.SINGLE_PERSPECTIVE:
                return "单视角";
            case VideoType.MULTI_ANGLE:
                return "多视角";
            default:
                return "单视角";
        }
    }

    public static getVideoTypeId(type: string): VideoType {
        switch (type) {
            case "单视角":
                return VideoType.SINGLE_PERSPECTIVE;
            case "多视角":
                return VideoType.MULTI_ANGLE;
            default:
                return VideoType.SINGLE_PERSPECTIVE;
        }
    }

    public static getVideoStatusName(status: VideoStatus): string {
        switch (status) {
            case VideoStatus.PROCESSING:
                return "正在处理";
            case VideoStatus.COMPLETED:
                return "已完成";
            default:
                return "正在处理";
        }
    }

    public static getVideoStatusId(status: string): VideoStatus {
        switch (status) {
            case "正在处理":
                return VideoStatus.PROCESSING;
            case "已完成":
                return VideoStatus.COMPLETED;
            default:
                return VideoStatus.PROCESSING;
        }
    }

    public static getStatisticsPositionName(position: StatisticsPosition): string {
        switch (position) {
            case StatisticsPosition.TRUNK:
                return "躯干"
            case StatisticsPosition.PELVIS:
                return "骨盆"
            case StatisticsPosition.HIP:
                return "髋"
            case StatisticsPosition.KNEE:
                return "膝"
            case StatisticsPosition.FOOT:
                return "足"
            default:
                return "躯干";
        }
    }

    public static getStatisticsPositionId(position: string): StatisticsPosition {
        switch (position) {
            case "躯干":
                return StatisticsPosition.TRUNK;
            case "骨盆":
                return StatisticsPosition.PELVIS;
            case "髋":
                return StatisticsPosition.HIP;
            case "膝":
                return StatisticsPosition.KNEE;
            case "足":
                return StatisticsPosition.FOOT;
            default:
                return StatisticsPosition.TRUNK;
        }
    }

    public static getStatisticsPerspectiveName(perspective: StatisticsPerspective): string {
        switch (perspective) {
            case StatisticsPerspective.FORWARD_AND_BACKWARD_INCLINATION:
                return "前倾后倾角";
            case StatisticsPerspective.LEFT_TILT_RIGHT_TILT_ANGLE:
                return "左倾右倾角";
            case StatisticsPerspective.ROTATION_ANGLE:
                return "旋转角";
            case StatisticsPerspective.LEFT_FLEXION_AND_EXTENSION_ANGLE:
                return "左侧屈伸角";
            case StatisticsPerspective.RIGHT_FLEXION_AND_EXTENSION_ANGLE:
                return "右侧屈伸角";
            case StatisticsPerspective.LEFT_ADDUCTION_AND_ABDUCTION_ANGLE:
                return "左侧内收外展角";
            case StatisticsPerspective.RIGHT_ADDUCTION_AND_ABDUCTION_ANGLE:
                return "右侧内收外展角";
            default:
                return "前倾后倾角";
        }
    }

    public static getStatisticsPerspectiveId(perspective: string): StatisticsPerspective {
        switch (perspective) {
            case "前倾后倾角":
                return StatisticsPerspective.FORWARD_AND_BACKWARD_INCLINATION;
            case "左倾右倾角":
                return StatisticsPerspective.LEFT_TILT_RIGHT_TILT_ANGLE;
            case "旋转角":
                return StatisticsPerspective.ROTATION_ANGLE;
            case "左侧屈伸角":
                return StatisticsPerspective.LEFT_FLEXION_AND_EXTENSION_ANGLE;
            case "右侧屈伸角":
                return StatisticsPerspective.RIGHT_FLEXION_AND_EXTENSION_ANGLE;
            case "左侧内收外展角":
                return StatisticsPerspective.LEFT_ADDUCTION_AND_ABDUCTION_ANGLE;
            case "右侧内收外展角":
                return StatisticsPerspective.RIGHT_ADDUCTION_AND_ABDUCTION_ANGLE;
            default:
                return StatisticsPerspective.FORWARD_AND_BACKWARD_INCLINATION;
        }
    }

}